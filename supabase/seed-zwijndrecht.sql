-- FIELD Assist MVP - Seed data voor Gemeente Zwijndrecht
-- Voer dit uit in de Supabase SQL Editor

-- ============================================
-- 1. GEMEENTE ZWIJNDRECHT
-- ============================================
INSERT INTO gemeenten (id, name, active_fielders, contributions, description)
VALUES (
  'zwijndrecht',
  'Gemeente Zwijndrecht',
  3,
  12,
  'Zwijndrecht is een gemeente in de provincie Zuid-Holland met ongeveer 45.000 inwoners. De gemeente richt zich op duurzame ontwikkeling en heeft een actief VTH-beleid.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================
-- 2. KENNISBANK ARTIKELEN
-- ============================================

-- Artikel 1: Omgevingsvergunning bouwen
INSERT INTO articles (id, title, summary, content, category, tags, source, read_time, last_updated)
VALUES (
  'omgevingsvergunning-bouwen',
  'Omgevingsvergunning voor bouwen aanvragen',
  'Alles wat je moet weten over het aanvragen van een omgevingsvergunning voor bouwactiviteiten onder de Omgevingswet.',
  E'## Wanneer heb je een omgevingsvergunning nodig?

Sinds 1 januari 2024 geldt de Omgevingswet. Voor veel bouwactiviteiten heb je een omgevingsvergunning nodig. Dit geldt voor:

- Nieuwbouw van woningen en bedrijfspanden
- Uitbreidingen groter dan 4 meter diep
- Dakkapellen aan de voorzijde
- Erfafscheidingen hoger dan 2 meter

### Vergunningvrij bouwen

Sommige bouwwerken zijn vergunningvrij:
- Bijgebouwen tot 30m² in het achtererfgebied
- Dakkapellen aan de achterzijde (onder voorwaarden)
- Erfafscheidingen tot 2 meter op het achtererf

### De aanvraagprocedure

1. **Vooroverleg** - Optioneel maar aangeraden voor complexe projecten
2. **Indienen aanvraag** - Via het Omgevingsloket
3. **Ontvankelijkheidstoets** - Binnen 2 weken
4. **Inhoudelijke beoordeling** - Toets aan omgevingsplan en Bkl
5. **Besluit** - Reguliere procedure: 8 weken

### Toetsingskader

De aanvraag wordt getoetst aan:
- Het omgevingsplan van de gemeente
- Het Besluit bouwwerken leefomgeving (Bbl)
- Redelijke eisen van welstand
- Eventuele maatwerkregels

### Leges

De leges voor een omgevingsvergunning bouwen zijn afhankelijk van de bouwkosten. Raadpleeg de legesverordening van de betreffende gemeente.',
  'vergunningen',
  ARRAY['omgevingsvergunning', 'bouwen', 'omgevingswet', 'bouwactiviteit'],
  'Rijksoverheid / Omgevingswet',
  8,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content;

-- Artikel 2: Handhaving Omgevingsrecht
INSERT INTO articles (id, title, summary, content, category, tags, source, read_time, last_updated)
VALUES (
  'handhaving-omgevingsrecht',
  'Handhaving onder de Omgevingswet',
  'Hoe werkt handhaving van het omgevingsrecht? Een overzicht van de instrumenten en procedures.',
  E'## Handhavingsinstrumenten

Het bevoegd gezag heeft verschillende instrumenten voor handhaving:

### 1. Waarschuwing
Informele eerste stap om een overtreder te wijzen op de overtreding.

### 2. Last onder dwangsom
- Verplicht de overtreder om binnen een termijn de overtreding te beëindigen
- Bij niet-naleving wordt een dwangsom verbeurd
- De hoogte moet in redelijke verhouding staan tot het geschonden belang

### 3. Last onder bestuursdwang
- Het bestuursorgaan kan zelf ingrijpen
- Kosten worden verhaald op de overtreder
- Wordt toegepast bij spoedeisende situaties

### 4. Bestuurlijke boete
- Punitieve sanctie
- Kan worden opgelegd naast herstelsancties

## De handhavingsprocedure

1. **Constatering** - Toezichthouder constateert overtreding
2. **Vooraankondiging** - Brief met voornemen tot handhaving
3. **Zienswijze** - Overtreder kan reageren (4 weken)
4. **Besluit** - Definitief handhavingsbesluit
5. **Bezwaar** - Overtreder kan in bezwaar (6 weken)

## Beginselplicht tot handhaving

Er geldt een beginselplicht tot handhaving: het bestuursorgaan moet in principe handhavend optreden bij een overtreding. Alleen in bijzondere omstandigheden kan hiervan worden afgezien (concreet zicht op legalisatie, onevenredigheid).',
  'handhaving',
  ARRAY['handhaving', 'dwangsom', 'bestuursdwang', 'toezicht'],
  'VNG / Handreiking handhaving',
  10,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content;

-- Artikel 3: Besluit bouwwerken leefomgeving
INSERT INTO articles (id, title, summary, content, category, tags, source, read_time, last_updated)
VALUES (
  'besluit-bouwwerken-leefomgeving',
  'Besluit bouwwerken leefomgeving (Bbl)',
  'Het Bbl bevat de technische eisen voor bouwwerken. Een overzicht van de belangrijkste regels.',
  E'## Wat is het Bbl?

Het Besluit bouwwerken leefomgeving (Bbl) is onderdeel van de Omgevingswet en bevat:
- Technische bouweisen
- Eisen voor bestaande bouw
- Eisen voor verbouw
- Eisen voor tijdelijke bouw

## Belangrijke onderdelen

### Nieuwbouw
- Constructieve veiligheid
- Brandveiligheid
- Energieprestatie (BENG)
- Toegankelijkheid
- Milieuprestatie (MPG)

### Bestaande bouw
- Minimale eisen voor veiligheid
- Eisen bij verbouw
- Niveau rechtens verkregen

### Brandveiligheid
- Vluchtwegen
- Brandcompartimentering
- Rookmelders (verplicht sinds 2022)
- Brandblusmiddelen

## BENG-eisen

Voor nieuwbouw gelden de BENG-eisen (Bijna Energieneutrale Gebouwen):
- BENG 1: Maximale energiebehoefte (kWh/m²)
- BENG 2: Maximaal primair fossiel energieverbruik
- BENG 3: Minimaal aandeel hernieuwbare energie

## Controle en toezicht

De gemeente of een kwaliteitsborger controleert of aan het Bbl wordt voldaan. Onder de Wet kwaliteitsborging (Wkb) verschuift de controle voor eenvoudige bouwwerken naar private kwaliteitsborgers.',
  'juridisch',
  ARRAY['bbl', 'technische eisen', 'bouwbesluit', 'brandveiligheid', 'beng'],
  'Rijksoverheid / Bbl',
  12,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content;

-- Artikel 4: Wet kwaliteitsborging
INSERT INTO articles (id, title, summary, content, category, tags, source, read_time, last_updated)
VALUES (
  'wet-kwaliteitsborging',
  'Wet kwaliteitsborging voor het bouwen (Wkb)',
  'De Wkb verandert het bouwtoezicht. Wat betekent dit voor gemeenten en aannemers?',
  E'## Wat is de Wkb?

De Wet kwaliteitsborging voor het bouwen is per 1 januari 2024 volledig in werking. De wet:
- Verschuift de bouwtechnische toets van gemeente naar private kwaliteitsborger
- Vergroot de aansprakelijkheid van de aannemer
- Introduceert een verplicht dossier bevoegd gezag

## Gevolgklassen

De Wkb werkt met gevolgklassen:

### Gevolgklasse 1 (nu van kracht)
- Grondgebonden woningen
- Eenvoudige bedrijfspanden
- Verbouw zonder constructieve wijzigingen

### Gevolgklasse 2 en 3 (later)
- Complexere gebouwen
- Publieke gebouwen
- Hoogbouw

## Rol van de gemeente

De gemeente:
- Toetst niet meer bouwtechnisch (bij GK1)
- Ontvangt de bouwmelding (4 weken voor start)
- Ontvangt de gereedmelding met dossier bevoegd gezag
- Houdt toezicht op ruimtelijke aspecten
- Kan handhaven bij gebreken

## Rol kwaliteitsborger

De kwaliteitsborger:
- Is ingeschreven in het landelijk register
- Werkt met een toegelaten instrument
- Toetst het bouwplan aan het Bbl
- Houdt toezicht tijdens de bouw
- Geeft een verklaring af bij oplevering

## Dossier bevoegd gezag

Bij gereedmelding ontvangt de gemeente:
- Verklaring kwaliteitsborger
- As-built tekeningen
- Bewijsstukken brandveiligheid
- Energieprestatie berekening',
  'vergunningen',
  ARRAY['wkb', 'kwaliteitsborging', 'gevolgklasse', 'bouwtoezicht'],
  'Rijksoverheid / Wkb',
  10,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content;

-- Artikel 5: Bezwaar en beroep
INSERT INTO articles (id, title, summary, content, category, tags, source, read_time, last_updated)
VALUES (
  'bezwaar-beroep-omgevingsrecht',
  'Bezwaar en beroep in het omgevingsrecht',
  'Hoe werkt de rechtsbescherming bij besluiten onder de Omgevingswet?',
  E'## Rechtsbescherming

Tegen besluiten onder de Omgevingswet staat rechtsbescherming open. De procedure hangt af van het type besluit.

## Reguliere procedure

### Bezwaar
- Termijn: 6 weken na bekendmaking
- Ingediend bij het bestuursorgaan
- Besluit op bezwaar: 6-12 weken

### Beroep
- Termijn: 6 weken na besluit op bezwaar
- Ingediend bij de rechtbank
- Behandeling: circa 6 maanden

### Hoger beroep
- Termijn: 6 weken na uitspraak rechtbank
- Ingediend bij de Afdeling bestuursrechtspraak van de Raad van State

## Uitgebreide procedure

Bij besluiten met uitgebreide procedure (afdeling 3.4 Awb):
- Geen bezwaar, direct beroep
- Eerst zienswijze tijdens de voorbereidingsfase
- Beroep bij de rechtbank

## Schorsende werking

- Bezwaar en beroep hebben geen schorsende werking
- Een voorlopige voorziening kan worden aangevraagd
- De voorzieningenrechter beslist snel

## Tips voor de praktijk

- Let op de termijnen (fataal!)
- Pro forma bezwaar is mogelijk
- Onderbouw bezwaargronden concreet
- Overweeg mediation',
  'juridisch',
  ARRAY['bezwaar', 'beroep', 'rechtsbescherming', 'awb'],
  'Raad van State / Awb',
  8,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content;

-- ============================================
-- 3. GEMEENTE CONTENT VOOR ZWIJNDRECHT
-- ============================================

-- Proces: Omgevingsvergunning
INSERT INTO gemeente_content (gemeente_id, type, title, content)
VALUES (
  'zwijndrecht',
  'process',
  'Omgevingsvergunning aanvragen',
  '{
    "stappen": [
      {"nummer": 1, "titel": "Vooroverleg aanvragen", "beschrijving": "Optioneel: vraag een vooroverleg aan via het Omgevingsloket", "termijn": "4 weken"},
      {"nummer": 2, "titel": "Aanvraag indienen", "beschrijving": "Dien de aanvraag in via het Omgevingsloket met alle benodigde documenten", "termijn": "-"},
      {"nummer": 3, "titel": "Ontvankelijkheidstoets", "beschrijving": "Gemeente controleert of de aanvraag compleet is", "termijn": "2 weken"},
      {"nummer": 4, "titel": "Inhoudelijke beoordeling", "beschrijving": "Toets aan omgevingsplan, Bbl en welstand", "termijn": "6 weken"},
      {"nummer": 5, "titel": "Besluit", "beschrijving": "Vergunning verleend of geweigerd", "termijn": "8 weken totaal"}
    ],
    "documenten": ["Bouwtekeningen", "Constructieberekening", "Situatietekening", "Foto bestaande situatie"],
    "contact": "vergunningen@zwijndrecht.nl"
  }'
);

-- Proces: Handhavingsverzoek
INSERT INTO gemeente_content (gemeente_id, type, title, content)
VALUES (
  'zwijndrecht',
  'process',
  'Handhavingsverzoek indienen',
  '{
    "stappen": [
      {"nummer": 1, "titel": "Verzoek indienen", "beschrijving": "Dien schriftelijk een handhavingsverzoek in met omschrijving van de overtreding", "termijn": "-"},
      {"nummer": 2, "titel": "Ontvangstbevestiging", "beschrijving": "U ontvangt een bevestiging van ontvangst", "termijn": "1 week"},
      {"nummer": 3, "titel": "Onderzoek", "beschrijving": "Toezichthouder onderzoekt de situatie", "termijn": "4 weken"},
      {"nummer": 4, "titel": "Besluit", "beschrijving": "Besluit om wel of niet te handhaven", "termijn": "8 weken"}
    ],
    "documenten": ["Omschrijving overtreding", "Foto/bewijs", "Adresgegevens locatie"],
    "contact": "handhaving@zwijndrecht.nl"
  }'
);

-- Template: Vooraankondiging handhaving
INSERT INTO gemeente_content (gemeente_id, type, title, content)
VALUES (
  'zwijndrecht',
  'template',
  'Vooraankondiging last onder dwangsom',
  '{
    "type": "brief",
    "onderwerp": "Voornemen tot opleggen last onder dwangsom",
    "template": "Geachte [NAAM],\n\nOp [DATUM] heeft een toezichthouder van de gemeente Zwijndrecht geconstateerd dat u in strijd handelt met [VOORSCHRIFT]. De overtreding betreft:\n\n[OMSCHRIJVING OVERTREDING]\n\nWij zijn voornemens u een last onder dwangsom op te leggen. De last houdt in dat u binnen [TERMIJN] de overtreding moet beëindigen door [HERSTELMAATREGELEN]. Als u niet tijdig aan de last voldoet, verbeurt u een dwangsom van € [BEDRAG] per [TIJDSEENHEID/OVERTREDING] met een maximum van € [MAXIMUM].\n\nU kunt binnen vier weken na dagtekening van deze brief uw zienswijze kenbaar maken.\n\nMet vriendelijke groet,\n\nBurgemeester en wethouders van Zwijndrecht"
  }'
);

-- Template: Vergunningbesluit
INSERT INTO gemeente_content (gemeente_id, type, title, content)
VALUES (
  'zwijndrecht',
  'template',
  'Besluit omgevingsvergunning',
  '{
    "type": "besluit",
    "onderwerp": "Besluit op aanvraag omgevingsvergunning",
    "template": "Burgemeester en wethouders van Zwijndrecht,\n\nGelet op de aanvraag van [AANVRAGER] d.d. [DATUM] voor het [ACTIVITEIT] aan de [ADRES];\n\nOverwegende dat:\n- de aanvraag voldoet aan het omgevingsplan;\n- de aanvraag voldoet aan het Besluit bouwwerken leefomgeving;\n- er geen redenen zijn de vergunning te weigeren;\n\nBesluiten:\n\n1. De omgevingsvergunning te verlenen voor [ACTIVITEIT] aan de [ADRES].\n\n2. Aan deze vergunning de volgende voorschriften te verbinden:\n   [VOORSCHRIFTEN]\n\nBezwaar:\nBelanghebbenden kunnen binnen zes weken na de dag van verzending van dit besluit bezwaar maken.\n\nZwijndrecht, [DATUM]\n\nBurgemeester en wethouders van Zwijndrecht"
  }'
);

-- Contact informatie
INSERT INTO gemeente_content (gemeente_id, type, title, content)
VALUES (
  'zwijndrecht',
  'contact',
  'VTH-afdeling',
  '{
    "afdeling": "Vergunningen, Toezicht en Handhaving",
    "telefoon": "078-770 8000",
    "email": "info@zwijndrecht.nl",
    "adres": "Raadhuisplein 1, 3331 KN Zwijndrecht",
    "openingstijden": "Maandag t/m vrijdag 09:00-17:00",
    "website": "https://www.zwijndrecht.nl"
  }'
);

-- Tips voor Zwijndrecht
INSERT INTO gemeente_content (gemeente_id, type, title, content)
VALUES (
  'zwijndrecht',
  'tip',
  'Sneller vergunning met vooroverleg',
  '{
    "tip": "Een vooroverleg aanvragen voorkomt verrassingen bij de formele aanvraag. De gemeente geeft aan of het plan past binnen het omgevingsplan en welke documenten nodig zijn.",
    "categorie": "vergunningen"
  }'
),
(
  'zwijndrecht',
  'tip',
  'Gebruik het Omgevingsloket',
  '{
    "tip": "Via het Omgevingsloket (omgevingswet.overheid.nl) kunt u een vergunningcheck doen, vooroverleg aanvragen en de formele aanvraag indienen.",
    "categorie": "vergunningen"
  }'
);

-- ============================================
-- 4. CONFIRM DATA
-- ============================================
SELECT 'Gemeente toegevoegd:' as status, name FROM gemeenten WHERE id = 'zwijndrecht';
SELECT 'Artikelen toegevoegd:' as status, COUNT(*) as aantal FROM articles;
SELECT 'Gemeente content toegevoegd:' as status, COUNT(*) as aantal FROM gemeente_content WHERE gemeente_id = 'zwijndrecht';
