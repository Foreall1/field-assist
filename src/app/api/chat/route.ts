import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';
import { createAPIRouteClient } from '@/lib/supabase-server';
import { createEmbedding } from '@/lib/embeddings';
import {
  SYSTEM_PROMPT,
  getRoleInstructions,
  buildContextPrompt,
  extractCitations,
} from '@/lib/ai-service';
import { UserRole, Citation } from '@/lib/types';

// Lazy initialization of OpenAI client
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface ChatRequest {
  query: string;
  userRole?: UserRole;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  stream?: boolean;
  gemeenteId?: string; // Optional filter for gemeente-specific searches
}

// Search for relevant articles using vector similarity
async function searchRelevantArticles(query: string, limit: number = 5) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await createEmbedding(query);

    // Search using Supabase vector similarity
    const supabase = createServerClient();
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

    return data || [];
  } catch (error) {
    console.error('Error in searchRelevantArticles:', error);
    return [];
  }
}

// Fallback: keyword-based search
async function keywordSearchArticles(query: string, limit: number = 5) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, summary, content, category')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error in keyword search:', error);
    return [];
  }

  return data || [];
}

// Search in document chunks (uploaded documents)
async function searchDocumentChunks(query: string, limit: number = 5, gemeenteId?: string) {
  try {
    const queryEmbedding = await createEmbedding(query);
    const supabase = createServerClient();

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

    return data || [];
  } catch (error) {
    console.error('Error in searchDocumentChunks:', error);
    return [];
  }
}

// Keyword search in document chunks
async function keywordSearchDocumentChunks(query: string, limit: number = 5) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('document_chunks')
    .select('id, source_type, source_id, title, content, gemeente_id')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error in keyword search documents:', error);
    return [];
  }

  return data || [];
}

export async function POST(request: NextRequest) {
  try {
    // Authenticatie check - alleen ingelogde gebruikers
    const supabaseAuth = await createAPIRouteClient();
    const { data: { session } } = await supabaseAuth.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Je moet ingelogd zijn om de chat te gebruiken' },
        { status: 401 }
      );
    }

    const body: ChatRequest = await request.json();
    const { query, userRole, conversationHistory = [], stream = false, gemeenteId } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

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
    const allRelevantContent = [
      ...relevantDocuments.map((doc: { id: string; source_type: string; title: string; content: string; gemeente_id?: string }) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        category: doc.source_type,
        source: doc.gemeente_id ? `Gemeente ${doc.gemeente_id}` : 'Geüpload document',
      })),
      ...relevantArticles,
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
      const streamResponse = await openai.chat.completions.create({
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

            for await (const chunk of streamResponse) {
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
            controller.error(error);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
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

      return NextResponse.json({
        content,
        citations,
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate response',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
