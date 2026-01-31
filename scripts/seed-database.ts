/**
 * Seed Script voor FIELD Assist Database
 *
 * Voer dit script uit na het aanmaken van de Supabase tabellen:
 * npx ts-node scripts/seed-database.ts
 *
 * Of via de Supabase SQL Editor met de gegenereerde INSERT statements.
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Configuratie
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Seed Data

const gemeenten = [
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    active_fielders: 8,
    contributions: 47,
    description: 'Gemeente Rotterdam - Dienst Stadsontwikkeling',
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    active_fielders: 12,
    contributions: 63,
    description: 'Gemeente Amsterdam - Afdeling Vergunningen en Handhaving',
  },
  {
    id: 'utrecht',
    name: 'Utrecht',
    active_fielders: 5,
    contributions: 31,
    description: 'Gemeente Utrecht - Team VTH',
  },
  {
    id: 'arnhem',
    name: 'Arnhem',
    active_fielders: 4,
    contributions: 22,
    description: 'Gemeente Arnhem - Cluster Leefomgeving',
  },
  {
    id: 'den-haag',
    name: 'Den Haag',
    active_fielders: 10,
    contributions: 55,
    description: 'Gemeente Den Haag - Dienst Stadsbeheer',
  },
  {
    id: 'eindhoven',
    name: 'Eindhoven',
    active_fielders: 6,
    contributions: 38,
    description: 'Gemeente Eindhoven - Domein Ruimte',
  },
];

const articles = [
  {
    id: 'omgevingswet-wijzigingen',
    title: 'Nieuwe Omgevingswet: wat verandert er voor vergunningverlening?',
    summary:
      'Een overzicht van de belangrijkste wijzigingen in het vergunningstelsel onder de Omgevingswet.',
    content: `De Omgevingswet is op 1 januari 2024 in werking getreden en brengt fundamentele wijzigingen voor vergunningverlening.

## Belangrijkste wijzigingen

### 1. Eén omgevingsvergunning
Onder de Omgevingswet is er één omgevingsvergunning voor alle activiteiten in de fysieke leefomgeving. Dit vervangt de 26 verschillende vergunningen die voorheen bestonden.

### 2. Kortere procedures
- Reguliere procedure: 8 weken (was 8-26 weken)
- Uitgebreide procedure: 26 weken
- Eenmalige verdaging mogelijk met 6 weken

### 3. Digitaal Stelsel Omgevingswet (DSO)
Alle aanvragen verlopen via het DSO. Dit systeem verbindt alle betrokken partijen en zorgt voor een gestroomlijnd proces.

### 4. Omgevingsplan vervangt bestemmingsplannen
Gemeenten werken met één omgevingsplan waarin alle regels over de fysieke leefomgeving zijn opgenomen.

## Praktische gevolgen

- Nieuwe toetsingskaders en beoordelingsregels
- Meer ruimte voor maatwerk en lokale afwegingen
- "Ja, mits"-benadering in plaats van "nee, tenzij"
- Participatie speelt een grotere rol`,
    category: 'vergunningen',
    tags: ['omgevingswet', 'vergunningen', 'procedures', 'DSO'],
    source: 'FIELD Kennisbank',
    read_time: 8,
    last_updated: '2024-01-20',
  },
  {
    id: 'handhaving-illegale-bouw',
    title: 'Handhavingsstrategie bij illegale bouw',
    summary:
      'Praktische handvatten voor een effectieve handhavingsaanpak bij constatering van illegale bouwwerken.',
    content: `Bij handhaving van illegale bouwwerken is een zorgvuldige en consequente aanpak essentieel.

## Stappenplan handhaving

### 1. Constatering en vastlegging
- Maak een proces-verbaal van bevindingen
- Leg de overtreding fotografisch vast
- Identificeer de overtreder (eigenaar/gebruiker)
- Bepaal de omvang van de overtreding

### 2. Voornemen handhavend optreden
- Informeer de overtreder schriftelijk over het voornemen
- Bied een zienswijzetermijn van minimaal 2 weken
- Vermeld de voorgenomen sanctie

### 3. Keuze handhavingsinstrument
**Last onder dwangsom:**
- Effectief bij herstelbare overtredingen
- Bepaal een redelijke begunstigingstermijn
- Stel een proportionele dwangsom vast

**Last onder bestuursdwang:**
- Bij spoedeisende situaties
- Bij herhaalde overtredingen
- Wanneer dwangsom niet effectief is gebleken

**Bestuurlijke boete:**
- Bij bepaalde milieuovertredingen
- Als punitieve sanctie

### 4. Uitvoering en opvolging
- Respecteer de begunstigingstermijn
- Volg de naleving actief op
- Verbeur dwangsommen bij niet-naleving
- Overweeg invorderings- of executiemaatregelen

## Beginselplicht tot handhaving
Als bestuursorgaan bent u in beginsel verplicht handhavend op te treden bij geconstateerde overtredingen. Alleen in bijzondere gevallen kan hiervan worden afgezien.`,
    category: 'handhaving',
    tags: ['handhaving', 'illegale bouw', 'dwangsom', 'bestuursdwang'],
    source: 'FIELD Kennisbank',
    read_time: 6,
    last_updated: '2024-01-12',
  },
  {
    id: 'bezwaarprocedure-awb',
    title: 'Bezwaarprocedures onder de Awb: actuele jurisprudentie',
    summary:
      'Analyse van recente uitspraken over bezwaarprocedures en de impact op de gemeentelijke praktijk.',
    content: `De bezwaarprocedure onder de Algemene wet bestuursrecht (Awb) kent belangrijke formele en inhoudelijke aspecten.

## Termijnen

### Bezwaartermijn
- 6 weken na bekendmaking van het besluit
- Termijn is fataal: te laat = niet-ontvankelijk
- Uitzondering bij verschoonbare termijnoverschrijding

### Beslistermijn
- 6 weken (12 weken bij adviescommissie)
- Verdaging mogelijk met maximaal 6 weken
- Bij niet tijdig beslissen: dwangsom mogelijk

## Vereisten bezwaarschrift

Een ontvankelijk bezwaarschrift bevat:
1. Naam en adres indiener
2. Dagtekening
3. Omschrijving van het besluit waartegen bezwaar wordt gemaakt
4. Gronden van bezwaar

## Procedurele aspecten

### Hoorzitting
- Uitgangspunt is dat de bezwaarmaker wordt gehoord
- Uitzondering bij kennelijk niet-ontvankelijk of ongegrond
- Belanghebbende kan schriftelijk afzien van horen

### Heroverweging
- Volledige heroverweging van het primaire besluit
- Ex-nunc: toetsing aan feiten en recht ten tijde van beslissing op bezwaar
- Nieuwe feiten en argumenten mogen worden meegenomen

## Recente jurisprudentie

Aandachtspunten uit recente rechtspraak:
- Strenge toetsing op motivering van besluiten
- Kenbare belangenafweging vereist
- Vertrouwensbeginsel krijgt meer gewicht
- Formele gebreken kunnen worden gepasseerd (art. 6:22 Awb)`,
    category: 'juridisch',
    tags: ['awb', 'bezwaar', 'jurisprudentie', 'procedures'],
    source: 'FIELD Kennisbank',
    read_time: 12,
    last_updated: '2024-01-18',
  },
  {
    id: 'bestemmingsplan-omgevingsplan',
    title: 'Bestemmingsplan vs. Omgevingsplan: de overgang',
    summary:
      'Hoe bestaande bestemmingsplannen worden omgezet naar het nieuwe omgevingsplan.',
    content: `Met de inwerkingtreding van de Omgevingswet worden bestemmingsplannen onderdeel van het omgevingsplan.

## Transitieperiode

### Automatische omzetting
Alle geldende bestemmingsplannen zijn per 1 januari 2024 automatisch onderdeel geworden van het tijdelijke deel van het omgevingsplan (de "bruidsschat").

### Termijn voor omzetting
Gemeenten hebben tot 2032 de tijd om het omgevingsplan volledig vast te stellen volgens de nieuwe systematiek.

## Belangrijke verschillen

### Bestemmingsplan (oud)
- Ruimtelijke ordening centraal
- Strikte scheiding tussen functies
- Gedetailleerde bouw- en gebruiksregels
- Beperkte afwijkingsmogelijkheden

### Omgevingsplan (nieuw)
- Integrale benadering fysieke leefomgeving
- Meer flexibiliteit en maatwerk
- Bredere scope: ook milieu, welstand, etc.
- Meer open normen en afwegingsruimte

## Praktische gevolgen

1. **Dubbele toetsing**: Gedurende de transitie toetsen aan zowel oud als nieuw recht
2. **Documentatie**: Houd bij welke plangebieden al zijn omgezet
3. **Participatie**: Bij omzetting is participatie verplicht
4. **Delegatie**: Gebruik de mogelijkheid van delegatiebesluiten`,
    category: 'ruimtelijke-ordening',
    tags: ['bestemmingsplan', 'omgevingsplan', 'transitie', 'omgevingswet'],
    source: 'FIELD Kennisbank',
    read_time: 10,
    last_updated: '2024-01-08',
  },
  {
    id: 'energielabel-c-kantoren',
    title: 'Energielabel C-verplichting kantoren: handhaving in de praktijk',
    summary:
      'Stand van zaken rondom de handhaving van de energielabel C-verplichting voor kantoorgebouwen.',
    content: `Sinds 1 januari 2023 moeten kantoorgebouwen minimaal energielabel C hebben. Dit heeft gevolgen voor handhaving.

## Wettelijk kader

### Verplichting
- Kantoorgebouwen > 100 m² moeten minimaal label C hebben
- Geldt voor zowel eigenaren als gebruikers
- Verbod op gebruik bij niet-voldoen

### Uitzonderingen
- Monumenten (onder voorwaarden)
- Gebouwen die binnen 2 jaar worden gesloopt
- Tijdelijke gebouwen (< 2 jaar)

## Handhavingsaanpak

### Inventarisatie
1. Breng alle kantoorgebouwen in kaart
2. Controleer geregistreerde energielabels
3. Prioriteer handhaving op basis van risico

### Handhavingsinstrumenten
- Waarschuwing/last onder dwangsom
- Sluiting gebouw als ultimum remedium
- Bestuurlijke boete (max. € 22.500)

## Praktijkervaring

**Uitdagingen:**
- Splitste panden (kantoor + overige functies)
- VvE-situaties
- Internationale eigenaren
- Discussie over meetmethodes

**Tips:**
- Start met informerende brief
- Bied ondersteuning bij verduurzaming
- Werk samen met energieloketten
- Houd rekening met de energiecrisis`,
    category: 'milieu',
    tags: ['energielabel', 'kantoren', 'duurzaamheid', 'handhaving'],
    source: 'FIELD Kennisbank',
    read_time: 7,
    last_updated: '2024-01-15',
  },
  {
    id: 'constructieve-veiligheid',
    title: 'Constructieve veiligheid bij verbouwingen',
    summary:
      'Aandachtspunten bij de beoordeling van constructieve veiligheid bij verbouwingsaanvragen.',
    content: `Bij verbouwingsaanvragen is beoordeling van constructieve veiligheid essentieel voor een veilige leefomgeving.

## Beoordelingskader

### Besluit bouwwerken leefomgeving (Bbl)
Het Bbl bevat de technische eisen voor bestaande bouw en verbouw. Bij verbouwing gelden vaak verlichte eisen ten opzichte van nieuwbouw.

### Verbouwniveau
- Nieuwbouwniveau (streng)
- Verbouwniveau (minder streng)
- Niveau bestaande bouw (rechtens verkregen niveau)

## Aandachtspunten bij beoordeling

### 1. Constructieve berekeningen
- Is de berekening opgesteld door een erkend constructeur?
- Zijn alle belastingen correct meegenomen?
- Is de materiaalkeuze juist?

### 2. Uitvoeringsaspecten
- Tijdelijke constructies tijdens de bouw
- Aansluiting op bestaande constructie
- Funderingsaspecten

### 3. Risicovolle situaties
Let extra op bij:
- Draagmuren die worden verwijderd
- Uitbreidingen op bestaande constructies
- Kelderuitgravingen
- Dakterrassen

## Toezicht en handhaving

**Controlemomenten:**
1. Voorafgaand aan start bouw
2. Bij aanleg fundering/staalconstructie
3. Voor het aanbrengen van afwerking
4. Bij oplevering

**Signalen voor extra aandacht:**
- Afwijkingen van vergunde tekeningen
- Klachten van buren over trillingen/scheuren
- Geen erkend aannemer`,
    category: 'bouwen',
    tags: ['constructie', 'veiligheid', 'verbouwing', 'Bbl'],
    source: 'FIELD Kennisbank',
    read_time: 9,
    last_updated: '2024-01-03',
  },
];

const gemeenteContent = [
  // Rotterdam content
  {
    gemeente_id: 'rotterdam',
    type: 'process',
    title: 'Intake vergunningaanvraag',
    content: {
      steps: [
        'Ontvangst aanvraag via DSO',
        'Toewijzing aan behandelaar',
        'Ontvankelijkheidscheck (5 werkdagen)',
        'Start inhoudelijke behandeling',
      ],
      duration: '5 werkdagen',
      responsible: 'Team Intake',
    },
  },
  {
    gemeente_id: 'rotterdam',
    type: 'template',
    title: 'Conceptbesluit omgevingsvergunning',
    content: {
      description: 'Template voor conceptbesluit reguliere procedure',
      format: 'DOCX',
      lastUpdated: '2024-01-15',
    },
  },
  {
    gemeente_id: 'rotterdam',
    type: 'contact',
    title: 'Team Vergunningen',
    content: {
      name: 'Team Vergunningen Rotterdam',
      email: 'vergunningen@rotterdam.nl',
      phone: '14010',
      hours: 'Ma-Vr 9:00-17:00',
    },
  },
  // Amsterdam content
  {
    gemeente_id: 'amsterdam',
    type: 'process',
    title: 'Handhavingstraject starten',
    content: {
      steps: [
        'Constatering overtreding',
        'Proces-verbaal opstellen',
        'Voornemen last onder dwangsom',
        'Zienswijze ontvangen',
        'Definitief besluit',
      ],
      duration: '8-12 weken',
      responsible: 'Team Handhaving',
    },
  },
  {
    gemeente_id: 'amsterdam',
    type: 'template',
    title: 'Last onder dwangsom - illegale bouw',
    content: {
      description: 'Template voor last onder dwangsom bij illegale bouwwerken',
      format: 'DOCX',
      lastUpdated: '2024-01-10',
    },
  },
  // Utrecht content
  {
    gemeente_id: 'utrecht',
    type: 'handboek',
    title: 'Werkwijze bezwaarbehandeling',
    content: {
      description: 'Handleiding voor behandeling van bezwaarschriften',
      chapters: ['Ontvankelijkheid', 'Hoorzitting', 'Beslissing op bezwaar'],
      lastUpdated: '2023-12-01',
    },
  },
  {
    gemeente_id: 'utrecht',
    type: 'tip',
    title: 'Tip: Participatie onder Omgevingswet',
    content: {
      author: 'Jan de Vries',
      role: 'Senior vergunningverlener',
      text: 'Vraag bij complexe aanvragen altijd naar het participatieverslag. Dit voorkomt bezwaren in een later stadium.',
    },
  },
];

// Main seed function
async function seedDatabase() {
  console.log('Starting database seed...\n');

  // 1. Seed gemeenten
  console.log('Seeding gemeenten...');
  const { error: gemeentenError } = await supabase
    .from('gemeenten')
    .upsert(gemeenten, { onConflict: 'id' });

  if (gemeentenError) {
    console.error('Error seeding gemeenten:', gemeentenError);
  } else {
    console.log(`✓ Seeded ${gemeenten.length} gemeenten`);
  }

  // 2. Seed articles (without embeddings first)
  console.log('\nSeeding articles...');
  const articlesWithoutEmbeddings = articles.map(({ ...article }) => article);

  const { error: articlesError } = await supabase
    .from('articles')
    .upsert(articlesWithoutEmbeddings, { onConflict: 'id' });

  if (articlesError) {
    console.error('Error seeding articles:', articlesError);
  } else {
    console.log(`✓ Seeded ${articles.length} articles`);
  }

  // 3. Generate embeddings for articles
  if (OPENAI_API_KEY) {
    console.log('\nGenerating embeddings for articles...');
    for (const article of articles) {
      try {
        const textToEmbed = `${article.title}\n\n${article.summary}\n\n${article.content}`;
        const response = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: textToEmbed,
        });

        const embedding = response.data[0].embedding;

        const { error: updateError } = await supabase
          .from('articles')
          .update({ embedding })
          .eq('id', article.id);

        if (updateError) {
          console.error(`Error updating embedding for ${article.id}:`, updateError);
        } else {
          console.log(`✓ Generated embedding for: ${article.title}`);
        }
      } catch (err) {
        console.error(`Error generating embedding for ${article.id}:`, err);
      }
    }
  } else {
    console.log('\nSkipping embeddings (OPENAI_API_KEY not set)');
  }

  // 4. Seed gemeente content
  console.log('\nSeeding gemeente content...');
  const { error: contentError } = await supabase
    .from('gemeente_content')
    .insert(gemeenteContent);

  if (contentError) {
    console.error('Error seeding gemeente content:', contentError);
  } else {
    console.log(`✓ Seeded ${gemeenteContent.length} gemeente content items`);
  }

  console.log('\n✅ Database seed completed!');
}

// Run the seed
seedDatabase().catch(console.error);
