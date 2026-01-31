import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createAPIRouteClient } from '@/lib/supabase-server';
import { createEmbedding } from '@/lib/embeddings';

interface ProcessRequest {
  documentId: string;
  documentType: 'template' | 'handboek';
  title: string;
  content: string;
  gemeenteId?: string;
}

// Split text into chunks for better embedding search
function splitIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
  const sentences = text.split(/[.!?]+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    if (currentChunk.length + trimmedSentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = trimmedSentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxChunkSize)];
}

export async function POST(request: NextRequest) {
  try {
    // Authenticatie check - alleen ingelogde gebruikers
    const supabaseAuth = await createAPIRouteClient();
    const { data: { session } } = await supabaseAuth.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Je moet ingelogd zijn om documenten te verwerken' },
        { status: 401 }
      );
    }

    const body: ProcessRequest = await request.json();
    const { documentId, documentType, title, content, gemeenteId } = body;

    if (!documentId || !documentType || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Split content into chunks
    const chunks = splitIntoChunks(content);

    // Process each chunk
    const processedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Generate embedding for this chunk
      let embedding = null;
      try {
        embedding = await createEmbedding(`${title}: ${chunk}`);
      } catch (error) {
        console.error('Error creating embedding:', error);
        // Continue without embedding - will use keyword search instead
      }

      const chunkData = {
        source_type: documentType,
        source_id: documentId,
        gemeente_id: gemeenteId || null,
        title: title,
        content: chunk,
        chunk_index: i,
        embedding: embedding,
        metadata: {
          original_length: content.length,
          chunk_count: chunks.length,
        },
      };

      processedChunks.push(chunkData);
    }

    // Insert all chunks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('document_chunks') as any)
      .insert(processedChunks);

    if (insertError) {
      console.error('Error inserting chunks:', insertError);
      return NextResponse.json(
        { error: 'Failed to process document' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      chunksProcessed: processedChunks.length,
      message: 'Document processed successfully',
    });
  } catch (error) {
    console.error('Process document error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}
