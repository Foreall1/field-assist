// FIELD Assist data exports

export * from './types';
export * from './gemeenten';
export * from './rotterdam';
export * from './amsterdam';
export * from './utrecht';
export * from './wetgeving';
export * from './ai-responses';

// Helper to get gemeente content by ID
import { rotterdamContent, rotterdamBeleid } from './rotterdam';
import { amsterdamContent, amsterdamBeleid } from './amsterdam';
import { utrechtContent, utrechtBeleid } from './utrecht';
import { GemeenteContent, OpenbaarBeleid } from './types';

const gemeenteContentMap: Record<string, GemeenteContent> = {
  rotterdam: rotterdamContent,
  amsterdam: amsterdamContent,
  utrecht: utrechtContent,
};

const gemeenteBeleidMap: Record<string, OpenbaarBeleid[]> = {
  rotterdam: rotterdamBeleid,
  amsterdam: amsterdamBeleid,
  utrecht: utrechtBeleid,
};

export function getGemeenteContent(gemeenteId: string): GemeenteContent | null {
  return gemeenteContentMap[gemeenteId] || null;
}

export function getGemeenteBeleid(gemeenteId: string): OpenbaarBeleid[] {
  return gemeenteBeleidMap[gemeenteId] || [];
}

// Get all content across all gemeenten for network search
export function getAllNetworkContent() {
  return {
    processen: [
      ...rotterdamContent.processen.map(p => ({ ...p, gemeente: 'Rotterdam' })),
      ...amsterdamContent.processen.map(p => ({ ...p, gemeente: 'Amsterdam' })),
      ...utrechtContent.processen.map(p => ({ ...p, gemeente: 'Utrecht' })),
    ],
    templates: [
      ...rotterdamContent.templates.map(t => ({ ...t, gemeente: 'Rotterdam' })),
      ...amsterdamContent.templates.map(t => ({ ...t, gemeente: 'Amsterdam' })),
      ...utrechtContent.templates.map(t => ({ ...t, gemeente: 'Utrecht' })),
    ],
    handboeken: [
      ...rotterdamContent.handboeken.map(h => ({ ...h, gemeente: 'Rotterdam' })),
      ...amsterdamContent.handboeken.map(h => ({ ...h, gemeente: 'Amsterdam' })),
      ...utrechtContent.handboeken.map(h => ({ ...h, gemeente: 'Utrecht' })),
    ],
  };
}

// Get trending templates (most downloads)
export function getTrendingTemplates(limit: number = 3) {
  const allTemplates = [
    ...rotterdamContent.templates.map(t => ({ ...t, gemeente: 'Rotterdam' })),
    ...amsterdamContent.templates.map(t => ({ ...t, gemeente: 'Amsterdam' })),
    ...utrechtContent.templates.map(t => ({ ...t, gemeente: 'Utrecht' })),
  ];

  return allTemplates
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}
