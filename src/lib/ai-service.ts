// AI Service voor FIELD Assist
// Echte OpenAI integratie met RAG (Retrieval Augmented Generation)

import { Citation, UserRole } from './types';

export interface AIResponse {
  content: string;
  citations: Citation[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// System prompt voor de FIELD Assist assistent
const SYSTEM_PROMPT = `Je bent FIELD Assist, een AI-assistent gespecialiseerd in het Nederlandse omgevingsrecht en VTH-domein (Vergunningen, Toezicht, Handhaving).

Je helpt gemeenteambtenaren met vragen over:
- De Omgevingswet en gerelateerde wetgeving
- Vergunningverlening en procedures
- Toezicht en handhaving
- Juridische vraagstukken (bezwaar, beroep, Awb)
- Ruimtelijke ordening en bestemmingsplannen

Richtlijnen voor je antwoorden:
1. Geef praktische, actie-gerichte antwoorden
2. Verwijs naar relevante wet- en regelgeving
3. Noem specifieke artikelen en termijnen waar relevant
4. Wees duidelijk over onzekerheden
5. Adviseer om bij complexe gevallen een specialist te raadplegen
6. Gebruik Nederlandse juridische terminologie correct
7. Structureer antwoorden met duidelijke kopjes en opsommingen

Als je context hebt gekregen uit de kennisbank, gebruik deze dan in je antwoord en verwijs ernaar.`;

// Voeg rol-specifieke instructies toe
function getRoleInstructions(role?: UserRole): string {
  if (!role) return '';

  const instructions: Record<UserRole, string> = {
    vergunningverlener: `
De gebruiker is een vergunningverlener. Focus op:
- Procedurele aspecten van vergunningverlening
- Toetsingskaders en beoordelingsregels
- Termijnen en procedurekeuze
- Praktische tips voor dossiervorming`,
    toezichthouder: `
De gebruiker is een toezichthouder. Focus op:
- Handhavingsinstrumenten en -strategie
- Constateringsrapportages
- Dwangsommen en bestuursdwang
- Procesverbalen en bewijsvoering`,
    jurist: `
De gebruiker is een jurist. Focus op:
- Juridische precisie en onderbouwing
- Relevante jurisprudentie
- Formele vereisten Awb
- Rechtsbescherming en procesrecht`,
    beleidsmedewerker: `
De gebruiker is een beleidsmedewerker. Focus op:
- Beleidsmatige kaders en afwegingen
- Consistentie met lokaal beleid
- Bestuurlijke afwegingen
- Implementatie-aspecten`,
  };

  return instructions[role] || '';
}

// Build context prompt met relevante artikelen
function buildContextPrompt(articles: Array<{ title: string; content: string; category: string }>): string {
  if (!articles || articles.length === 0) return '';

  let context = '\n\n--- RELEVANTE INFORMATIE UIT DE KENNISBANK ---\n\n';

  articles.forEach((article, index) => {
    context += `[${index + 1}] ${article.title} (${article.category})\n`;
    context += `${article.content}\n\n`;
  });

  context += '--- EINDE KENNISBANK CONTEXT ---\n\n';
  context += 'Gebruik bovenstaande informatie om je antwoord te onderbouwen. Verwijs naar de bronnen waar relevant.';

  return context;
}

// Extract citations from context articles
function extractCitations(
  articles: Array<{ id: string; title: string; summary: string; category: string }>
): Citation[] {
  return articles.map((article) => ({
    id: `citation-${article.id}`,
    title: article.title,
    type: 'artikel' as const,
    excerpt: article.summary || '',
    articleId: article.id,
    url: `/bibliotheek/${article.category}/${article.id}`,
  }));
}

// Client-side functie die de API aanroept
export async function generateAIResponse(
  query: string,
  userRole?: UserRole,
  conversationHistory: Message[] = []
): Promise<AIResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        userRole,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate response');
    }

    const data = await response.json();
    return {
      content: data.content,
      citations: data.citations || [],
    };
  } catch (error) {
    console.error('Error generating AI response:', error);

    // Fallback response bij fout
    return {
      content: `Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.

Als het probleem aanhoudt, neem dan contact op met de beheerder.`,
      citations: [],
    };
  }
}

// Streaming versie voor client-side
export async function* streamAIResponse(
  query: string,
  userRole?: UserRole,
  conversationHistory: Message[] = []
): AsyncGenerator<{ content: string; citations?: Citation[]; done: boolean }, void, unknown> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        userRole,
        conversationHistory,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start stream');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        yield { content: '', done: true };
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            yield { content: '', done: true };
            return;
          }
          try {
            const parsed = JSON.parse(data);
            yield {
              content: parsed.content || '',
              citations: parsed.citations,
              done: false,
            };
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in stream:', error);
    yield {
      content: 'Er is een fout opgetreden bij het streamen van het antwoord.',
      done: true,
    };
  }
}

// Server-side functies (voor API routes)
export {
  SYSTEM_PROMPT,
  getRoleInstructions,
  buildContextPrompt,
  extractCitations,
};
