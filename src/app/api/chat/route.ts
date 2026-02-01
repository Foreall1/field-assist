import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { createAPIRouteClient } from '@/infrastructure/supabase/server';
import { createEmbedding } from '@/lib/embeddings';
import {
  SYSTEM_PROMPT,
  getRoleInstructions,
  buildContextPrompt,
  extractCitations,
} from '@/lib/ai-service';
import { AppError } from '@/core/errors';
import { ChatRequestSchema } from '@/core/validation/schemas';
import { validateOrThrow } from '@/core/validation/validators';
import {
  withAuth,
  enforceRateLimit,
  successResponse,
  handleApiError,
  streamResponse,
  type AuthContext,
} from '../_lib';
import type { Citation } from '@/lib/types';
import type { MatchArticlesResult, MatchDocumentChunksResult } from '@/infrastructure/supabase/types';

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openaiClient) return openaiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw AppError.internal('OpenAI API key niet geconfigureerd');
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

// Search for relevant articles using vector similarity
async function searchRelevantArticles(query: string, limit = 5): Promise<MatchArticlesResult[]> {
  try {
    const queryEmbedding = await createEmbedding(query);
    const supabase = await createAPIRouteClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('match_articles', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
    });

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return (data as MatchArticlesResult[]) || [];
  } catch (error) {
    console.error('Error in searchRelevantArticles:', error);
    return [];
  }
}

// Fallback: keyword-based search
async function keywordSearchArticles(query: string, limit = 5) {
  const supabase = await createAPIRouteClient();

  // Sanitize query for ilike pattern
  const sanitizedQuery = query.replace(/[%_]/g, '');

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, summary, content, category')
    .or(`title.ilike.%${sanitizedQuery}%,summary.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`)
    .limit(limit);

  if (error) {
    console.error('Error in keyword search:', error);
    return [];
  }

  return data || [];
}

// Search in document chunks (uploaded documents)
async function searchDocumentChunks(
  query: string,
  limit = 5,
  gemeenteId?: string
): Promise<MatchDocumentChunksResult[]> {
  try {
    const queryEmbedding = await createEmbedding(query);
    const supabase = await createAPIRouteClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
      filter_gemeente_id: gemeenteId || null,
    });

    if (error) {
      console.error('Error searching document chunks:', error);
      return [];
    }

    return (data as MatchDocumentChunksResult[]) || [];
  } catch (error) {
    console.error('Error in searchDocumentChunks:', error);
    return [];
  }
}

// Keyword search in document chunks
async function keywordSearchDocumentChunks(query: string, limit = 5) {
  const supabase = await createAPIRouteClient();

  // Sanitize query for ilike pattern
  const sanitizedQuery = query.replace(/[%_]/g, '');

  const { data, error } = await supabase
    .from('document_chunks')
    .select('id, document_type, document_id, title, content, gemeente_id')
    .or(`title.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`)
    .limit(limit);

  if (error) {
    console.error('Error in keyword search documents:', error);
    return [];
  }

  return data || [];
}

interface RelevantContent {
  id: string;
  title: string;
  content: string;
  category: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: NextRequest, context: AuthContext) => {
    // Rate limiting - 20 requests per minuut per user
    const rateLimitResult = await enforceRateLimit(context.userId, 'chat');

    // Valideer request body
    const body = await req.json();
    const validatedData = validateOrThrow(ChatRequestSchema, body);

    const { query, userRole, conversationHistory, stream, gemeenteId } = validatedData;

    // Check OpenAI API key
    getOpenAIClient();

    // Search for relevant articles (try vector search first, fallback to keyword)
    let relevantArticles = await searchRelevantArticles(query);

    if (relevantArticles.length === 0) {
      relevantArticles = await keywordSearchArticles(query);
    }

    // Also search in uploaded documents
    let relevantDocuments = await searchDocumentChunks(query, 5, gemeenteId);

    if (relevantDocuments.length === 0) {
      relevantDocuments = await keywordSearchDocumentChunks(query);
    }

    // Combine results - documents from the gemeente first, then general articles
    const allRelevantContent: RelevantContent[] = [
      ...relevantDocuments.map((doc) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        category: doc.document_id || 'document',
        source: doc.gemeente_id ? `Gemeente ${doc.gemeente_id}` : 'Geüpload document',
      })),
      ...relevantArticles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        source: 'Kennisbank',
      })),
    ].slice(0, 8); // Limit total context

    // Build the system prompt with context
    const roleInstructions = getRoleInstructions(userRole);
    const contextPrompt = buildContextPrompt(allRelevantContent);

    const fullSystemPrompt = `${SYSTEM_PROMPT}${roleInstructions}${contextPrompt}`;

    // Build messages array
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: fullSystemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: query },
    ];

    // Generate citations from all relevant content
    const citations: Citation[] = extractCitations(allRelevantContent);

    const openai = getOpenAIClient();

    if (stream) {
      // Streaming response
      const streamOpenAI = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      });

      // Create a TransformStream for SSE
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Send citations first
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ citations })}\n\n`)
            );

            for await (const chunk of streamOpenAI) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                );
              }
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Stream error:', error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return streamResponse(readableStream, {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      });
    } else {
      // Non-streaming response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';

      return successResponse({
        content,
        citations,
      });
    }
  }).catch(handleApiError);
}
