# FIELD Assist

Een moderne kennisassistent voor professionals in het fysieke domein - vergunningverlening, toezicht, handhaving en juridische vraagstukken.

## Over FIELD Assist

FIELD Assist is een Next.js webapplicatie die professionals ondersteunt bij hun dagelijkse werk met:

- **AI-gestuurde kennisassistent** - Stel vragen en krijg contextbewuste antwoorden met bronverwijzingen
- **Uitgebreide kennisbank** - Artikelen over omgevingswet, vergunningen, handhaving en meer
- **Projectbeheer** - Organiseer uw werk met projecten, notities en gekoppelde gesprekken
- **Praktische tools** - Calculators, checklists en beslisbomen

## Functionaliteiten

### AI Assistent
- Streaming chat interface met typing effect
- Doorzoekt de kennisbank voor relevante informatie
- Geeft citaties met links naar bronartikelen
- Gesprekken koppelen aan projecten

### Kennisbank
- Artikelen per categorie (Vergunningen, Handhaving, Juridisch, etc.)
- Zoekfunctionaliteit
- Bladwijzers en leesgeschiedenis

### Projectbeheer
- Projecten aanmaken met naam, beschrijving en status
- Artikelen opslaan in projecten
- Notities toevoegen
- AI-gesprekken koppelen aan projecten

### Gebruikersprofiel
- Onboarding flow voor nieuwe gebruikers
- Profiel bewerken (naam, organisatie, rol)
- Instellingen voor thema en notificaties
- Data export functie

### Tools
- Termijncalculator
- Leges calculator
- Checklists voor vergunningen en handhaving
- Beslisbomen

## Technische Stack

- **Framework**: Next.js 14 (App Router)
- **Taal**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4 met RAG
- **Icons**: Lucide React

## Installatie

### 1. Clone en installeer

```bash
# Clone de repository
git clone [repository-url]
cd field-assist

# Installeer dependencies
npm install
```

### 2. Supabase Setup

1. Ga naar [supabase.com](https://supabase.com) en maak een nieuw project aan
2. Kopieer de URL en API keys van **Settings > API**
3. Maak het bestand `.env.local` aan (kopieer van `.env.example`):

```bash
cp .env.example .env.local
```

4. Vul de waarden in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your_openai_key
```

### 3. Database Setup

1. Ga naar de **SQL Editor** in je Supabase dashboard
2. Voer het script uit: `supabase/schema.sql`

### 4. Data Seeden (optioneel)

Vul de database met voorbeelddata:

```bash
npx ts-node scripts/seed-database.ts
```

### 5. Start de applicatie

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in uw browser.

## Scripts

| Command | Beschrijving |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Bouw productie versie |
| `npm run start` | Start productie server |
| `npm run lint` | Voer ESLint uit |

## Projectstructuur

```
src/
├── app/                    # Next.js App Router pagina's
│   ├── assistent/          # AI chat interface
│   ├── bibliotheek/        # Kennisbank
│   ├── dashboard/          # Gebruikersdashboard
│   │   ├── profiel/        # Profielpagina
│   │   └── instellingen/   # Instellingen
│   ├── onboarding/         # Welkomstflow
│   ├── projecten/          # Projectbeheer
│   │   └── [id]/           # Project detail
│   └── tools/              # Praktische hulpmiddelen
├── components/
│   ├── ui/                 # UI componenten (Avatar, Toast, etc.)
│   └── Header.tsx          # Hoofdnavigatie
├── contexts/               # React Context providers
│   ├── ChatContext.tsx     # AI gesprekken state
│   ├── ProjectContext.tsx  # Projecten state
│   ├── ToastContext.tsx    # Notificaties
│   └── UserContext.tsx     # Gebruiker state
├── data/
│   └── articles.json       # Kennisbank artikelen
└── lib/
    ├── ai-service.ts       # AI response generatie
    ├── storage.ts          # localStorage wrapper
    └── types.ts            # TypeScript types
```

## Huisstijl

De applicatie volgt de FIELD huisstijl:

| Kleur | Hex | Gebruik |
|-------|-----|---------|
| Primary | `#288978` | Hoofdkleur, knoppen, links |
| Primary Light | `#33a370` | Gradienten, accenten |
| Text Dark | `#2c3e50` | Hoofdtekst |
| Text Medium | `#415161` | Secundaire tekst |
| Text Light | `#8b97a5` | Subtiele tekst |
| Border | `#E2E7ED` | Randen, scheidingslijnen |
| Background | `#f8f9fb` | Achtergronden |

## Data Persistentie

In demo modus worden alle gegevens opgeslagen in localStorage:

- `field-assist-user` - Gebruikersprofiel
- `field-assist-projects` - Projecten
- `field-assist-conversations` - AI gesprekken

## Bijdragen

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/nieuwe-feature`)
3. Commit uw wijzigingen (`git commit -m 'Voeg nieuwe feature toe'`)
4. Push naar de branch (`git push origin feature/nieuwe-feature`)
5. Open een Pull Request

## Licentie

Dit project is eigendom van FIELD.

---

Ontwikkeld voor FIELD - Kennisplatform voor het fysieke domein
