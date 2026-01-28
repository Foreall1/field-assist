// AI Service voor FIELD Assist
// Simuleert AI-functionaliteit met kennis uit de knowledge base

import { Citation, UserRole } from './types';
import articles from '@/data/articles.json';

// Kennisbank artikelen
interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
}

// Voorgedefinieerde antwoorden per onderwerp
const knowledgeResponses: Record<string, { content: string; citationIds: string[] }> = {
  omgevingswet: {
    content: `De Omgevingswet is op 1 januari 2024 in werking getreden en brengt grote veranderingen met zich mee voor vergunningverlening.

**Belangrijkste wijzigingen:**

- **Eén omgevingsvergunning** voor alle activiteiten in de fysieke leefomgeving
- **Kortere procedures** met standaard termijn van 8 weken (regulier) of 26 weken (uitgebreid)
- **Digitaal Stelsel Omgevingswet (DSO)** voor alle aanvragen en publicaties
- **Omgevingsplan** vervangt bestemmingsplannen

**Praktische gevolgen voor uw werk:**

Als vergunningverlener krijgt u te maken met nieuwe toetsingskaders en beoordelingsregels. Het omgevingsplan van uw gemeente bepaalt welke activiteiten vergunningplichtig zijn.

Raadpleeg de bronnen hieronder voor meer details over specifieke onderdelen.`,
    citationIds: ['1', '4'],
  },
  vergunning: {
    content: `Bij een aanvraag omgevingsvergunning doorloopt u de volgende stappen:

**1. Ontvankelijkheidstoets**
Controleer of de aanvraag compleet is volgens de indieningsvereisten uit de Omgevingsregeling.

**2. Procedurekeuzje**
Bepaal of de reguliere (8 weken) of uitgebreide (26 weken) procedure van toepassing is.

**3. Inhoudelijke beoordeling**
Toets de aanvraag aan:
- Het omgevingsplan
- De beoordelingsregels uit het Besluit kwaliteit leefomgeving (Bkl)
- Eventuele beleidsregels

**4. Besluitvorming**
Neem tijdig een besluit om lex silencio (vergunning van rechtswege) te voorkomen.

**Let op:** Onder de Omgevingswet gelden de "ja, mits"-benadering en meer mogelijkheden voor maatwerk.`,
    citationIds: ['1'],
  },
  handhaving: {
    content: `Bij handhaving van illegale bouwwerken is een zorgvuldige aanpak essentieel.

**Stappenplan handhaving:**

1. **Constatering en vastlegging**
   - Maak een proces-verbaal van bevindingen
   - Leg de overtreding fotografisch vast
   - Identificeer de overtreder

2. **Voornemen handhavend optreden**
   - Informeer de overtreder over het voornemen
   - Bied een zienswijzetermijn van minimaal 2 weken

3. **Keuze handhavingsinstrument**
   - **Last onder dwangsom**: effectief bij herstelbare overtredingen
   - **Last onder bestuursdwang**: bij spoedeisende situaties
   - **Bestuurlijke boete**: bij bepaalde milieuovertredingen

4. **Uitvoering**
   - Respecteer de begunstigingstermijn
   - Volg de naleving actief op

**Beginselplicht tot handhaving:** Als bestuursorgaan bent u in beginsel verplicht handhavend op te treden bij geconstateerde overtredingen.`,
    citationIds: ['2'],
  },
  bezwaar: {
    content: `De bezwaarprocedure onder de Algemene wet bestuursrecht (Awb) kent belangrijke aandachtspunten.

**Termijnen:**
- Bezwaartermijn: 6 weken na bekendmaking besluit
- Beslistermijn: 6 weken (12 weken bij adviescommissie)
- Verdaging mogelijk met 6 weken

**Vereisten bezwaarschrift:**
- Naam en adres indiener
- Dagtekening
- Omschrijving van het besluit
- Gronden van bezwaar

**Procedurele aspecten:**
- Hoorzitting is uitgangspunt (tenzij kennelijk ongegrond/niet-ontvankelijk)
- Belanghebbende kan schriftelijk afzien van horen
- Volledig heroverweging van het primaire besluit

**Recente jurisprudentie** laat zien dat de rechter strenger toetst op:
- Motivering van besluiten
- Kenbare belangenafweging
- Vertrouwensbeginsel`,
    citationIds: ['3'],
  },
  termijn: {
    content: `Termijnen in de vergunningprocedure zijn cruciaal voor rechtmatige besluitvorming.

**Reguliere procedure:**
- Beslistermijn: 8 weken
- Eenmalig verdagen met 6 weken mogelijk
- **Let op:** bij overschrijding ontstaat geen vergunning van rechtswege meer (anders dan onder de Wabo)

**Uitgebreide procedure:**
- Beslistermijn: 26 weken na terinzagelegging ontwerp
- Geen verdaging mogelijk
- Toepassing bij complexe aanvragen (bijv. milieu)

**Opschortingsgronden:**
- Aanvulling aanvraag (max. 4 weken)
- Op verzoek aanvrager
- Overmacht

**Tips voor termijnbewaking:**
1. Registreer ontvangstdatum direct
2. Plan herinneringen voor tussentijdse deadlines
3. Communiceer proactief bij verwachte vertraging
4. Leg opschortingsgronden goed vast`,
    citationIds: ['1'],
  },
  default: {
    content: `Bedankt voor uw vraag. Op basis van de beschikbare informatie in de FIELD Assist kennisbank kan ik u het volgende meedelen:

Uw vraag raakt aan meerdere aspecten van het omgevingsrecht. Voor een volledig antwoord raad ik u aan om de relevante artikelen in onze bibliotheek te raadplegen.

**Suggesties voor verder onderzoek:**
- Zoek in de bibliotheek naar specifieke onderwerpen
- Raadpleeg de relevante wet- en regelgeving
- Neem bij complexe casussen contact op met een specialist

Kan ik u helpen met een specifiekere vraag over vergunningverlening, handhaving of juridische procedures?`,
    citationIds: [],
  },
};

// Zoek relevante artikelen op basis van query
function searchArticles(query: string): KnowledgeArticle[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  return (articles as KnowledgeArticle[])
    .map((article) => {
      let score = 0;

      // Check title
      if (article.title.toLowerCase().includes(queryLower)) score += 10;
      queryWords.forEach((word) => {
        if (article.title.toLowerCase().includes(word)) score += 2;
      });

      // Check summary
      if (article.summary.toLowerCase().includes(queryLower)) score += 5;
      queryWords.forEach((word) => {
        if (article.summary.toLowerCase().includes(word)) score += 1;
      });

      // Check tags
      article.tags.forEach((tag) => {
        if (queryLower.includes(tag.toLowerCase())) score += 3;
        queryWords.forEach((word) => {
          if (tag.toLowerCase().includes(word)) score += 1;
        });
      });

      // Check category
      if (article.category.toLowerCase().includes(queryLower)) score += 3;

      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ article }) => article);
}

// Bepaal het beste antwoord op basis van de query
function determineResponse(query: string): { content: string; citationIds: string[] } {
  const queryLower = query.toLowerCase();

  if (queryLower.includes('omgevingswet') || queryLower.includes('ow ')) {
    return knowledgeResponses.omgevingswet;
  }
  if (queryLower.includes('vergunning') || queryLower.includes('aanvraag')) {
    return knowledgeResponses.vergunning;
  }
  if (queryLower.includes('handhav') || queryLower.includes('illegaal') || queryLower.includes('dwangsom')) {
    return knowledgeResponses.handhaving;
  }
  if (queryLower.includes('bezwaar') || queryLower.includes('beroep') || queryLower.includes('awb')) {
    return knowledgeResponses.bezwaar;
  }
  if (queryLower.includes('termijn') || queryLower.includes('deadline') || queryLower.includes('weken')) {
    return knowledgeResponses.termijn;
  }

  return knowledgeResponses.default;
}

// Genereer citaties op basis van artikel IDs
function generateCitations(articleIds: string[]): Citation[] {
  const citations: Citation[] = [];

  for (const id of articleIds) {
    const article = (articles as KnowledgeArticle[]).find((a) => a.id === id);
    if (article) {
      citations.push({
        id: `citation-${article.id}`,
        title: article.title,
        type: 'artikel',
        excerpt: article.summary,
        articleId: article.id,
        url: `/bibliotheek/${article.category}/${article.id}`,
      });
    }
  }

  return citations;
}

// Streaming tekst simulatie
export async function* streamResponse(
  text: string,
  delayMs: number = 20
): AsyncGenerator<string, void, unknown> {
  const words = text.split(' ');

  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '');
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

// Hoofd AI functie
export interface AIResponse {
  content: string;
  citations: Citation[];
}

export async function generateAIResponse(
  query: string,
  userRole?: UserRole
): Promise<AIResponse> {
  // Simuleer API latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Bepaal antwoord
  const response = determineResponse(query);

  // Zoek additionele relevante artikelen
  const searchResults = searchArticles(query);
  const additionalCitationIds = searchResults
    .filter((article) => !response.citationIds.includes(article.id))
    .map((article) => article.id)
    .slice(0, 2);

  // Combineer citaties
  const allCitationIds = [...response.citationIds, ...additionalCitationIds];
  const citations = generateCitations(allCitationIds);

  // Voeg rol-specifieke context toe indien relevant
  let content = response.content;
  if (userRole && response !== knowledgeResponses.default) {
    const roleContext = getRoleContext(userRole);
    if (roleContext) {
      content += `\n\n**Specifiek voor ${getRoleName(userRole)}:**\n${roleContext}`;
    }
  }

  return {
    content,
    citations,
  };
}

// Rol-specifieke context
function getRoleContext(role: UserRole): string | null {
  const contexts: Record<UserRole, string> = {
    vergunningverlener: 'Let bij de beoordeling ook op de samenhang met andere vergunningplichtige activiteiten en de mogelijkheid van coördinatie.',
    toezichthouder: 'Zorg voor een goede vastlegging van constateringen en volg de interne werkprocessen voor handhaving.',
    jurist: 'Houd rekening met recente jurisprudentie en de formele vereisten uit de Awb.',
    beleidsmedewerker: 'Overweeg de beleidsmatige consequenties en eventuele aanpassing van lokale regels.',
  };
  return contexts[role] || null;
}

function getRoleName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    vergunningverlener: 'vergunningverleners',
    toezichthouder: 'toezichthouders',
    jurist: 'juristen',
    beleidsmedewerker: 'beleidsmedewerkers',
  };
  return names[role] || role;
}

// Export voor gebruik in componenten
export { searchArticles };
