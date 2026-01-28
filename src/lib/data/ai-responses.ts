// Pre-configured AI responses voor FIELD Assist demo

export interface AIResponse {
  vraag: string;
  keywords: string[];
  antwoord: string;
  bronnen?: { type: string; titel: string; extra?: string }[];
}

// Rotterdam AI responses
export const rotterdamAIResponses: AIResponse[] = [
  {
    vraag: "Hoe vraag ik een welstandsadvies aan?",
    keywords: ["welstand", "welstandsadvies", "commissie", "esthetisch"],
    antwoord: `Bij Rotterdam vraag je een welstandsadvies aan via het welstandsformulier op SharePoint.

**Belangrijke punten:**
1. Check eerst de welstandsnota of het gebied welstandsvrij is
2. Dien minimaal 3 weken voor de gewenste vergaderdatum in
3. De commissie vergadert elke 2e en 4e donderdag

**Tip van collega Mark:**
"De welstandscommissie is streng op kleurgebruik in het centrum. Vraag bij twijfel vooraf een vooroverleg aan."`,
    bronnen: [
      { type: "Proces", titel: "Welstandstoets aanvragen" },
      { type: "Beleid", titel: "Welstandsnota Rotterdam 2023" },
      { type: "Contact", titel: "Kees de Koning", extra: "welstand@rotterdam.nl" }
    ]
  },
  {
    vraag: "Wat is de procedure voor een omgevingsvergunning?",
    keywords: ["omgevingsvergunning", "vergunning", "aanvraag", "procedure", "bouwen"],
    antwoord: `Bij Rotterdam verloopt de aanvraag voor een omgevingsvergunning als volgt:

**Intake proces:**
1. Aanvraag komt binnen via Squit (zaaksysteem)
2. Binnen 2 werkdagen: ontvankelijkheidscheck door frontoffice
3. Toewijzing aan behandelaar op basis van complexiteit (A/B/C)
4. Bij categorie C: direct doorzetten naar senior vergunningverlener
5. Startgesprek inplannen binnen 5 werkdagen

**Tip van Lisa de Vries:**
"Bij Rotterdam altijd eerst checken of het perceel in het Nationaal Programma Rotterdam Zuid valt - daar gelden andere procedures."`,
    bronnen: [
      { type: "Proces", titel: "Intake aanvraag omgevingsvergunning" },
      { type: "Template", titel: "Checklist ontvankelijkheid", extra: "89 downloads" },
      { type: "Contact", titel: "Jan van den Berg", extra: "Teamleider Vergunningen" }
    ]
  },
  {
    vraag: "Wie moet ik benaderen voor een Bibob-vraag?",
    keywords: ["bibob", "integriteit", "juridisch"],
    antwoord: `Voor Bibob-gerelateerde vragen bij Rotterdam kun je terecht bij:

**Sandra Visser**
Juridisch adviseur
- Email: s.visser@rotterdam.nl
- Telefoon: 06-87654321

Zij behandelt alle juridische vragen, bezwaar & beroep, en Bibob-zaken.

**Tip:** Neem ruim van tevoren contact op, want Bibob-trajecten duren minimaal 8 weken.`,
    bronnen: [
      { type: "Contact", titel: "Sandra Visser", extra: "Juridisch adviseur" }
    ]
  },
  {
    vraag: "Hoe start ik een handhavingstraject?",
    keywords: ["handhaving", "dwangsom", "illegaal", "overtreding", "toezicht"],
    antwoord: `Bij Rotterdam doorloop je deze stappen voor handhaving:

**Proces handhavingstraject:**
1. Constatering vastleggen in ToezichtApp met foto's
2. Binnen 48 uur: rapport opmaken in Squit
3. Vooraankondiging versturen (standaard template)
4. Zienswijze termijn: 2 weken
5. Bij geen reactie: voornemen last onder dwangsom
6. Collegemandaat aanvragen via teamleider

**Let op:** Juridische zaken wil dat je altijd de perceelgegevens in de aanhef noemt.`,
    bronnen: [
      { type: "Proces", titel: "Handhavingstraject opstarten" },
      { type: "Template", titel: "Vooraankondiging handhaving", extra: "45 downloads" },
      { type: "Handboek", titel: "Mandaatregeling VTH Rotterdam" }
    ]
  }
];

// Amsterdam AI responses
export const amsterdamAIResponses: AIResponse[] = [
  {
    vraag: "Hoe werkt short-stay in Amsterdam?",
    keywords: ["short-stay", "vakantieverhuur", "airbnb", "verhuur", "toeristen"],
    antwoord: `Amsterdam heeft een streng beleid voor short-stay/vakantieverhuur:

**Vergunningcheck proces:**
1. Check quotum wijk via Short Stay Monitor
2. Controleer of pand in verboden gebied ligt
3. Aanvraag via Mijn Amsterdam portal
4. Automatische check op WOZ en eigendom
5. Bij goedkeuring: registratienummer binnen 5 werkdagen

**Let op:** Amsterdam heeft zero-tolerance beleid op illegale vakantieverhuur. Altijd direct handhaven bij constatering.

**Tip van Sophie Bakker:**
"Check altijd de Short Stay Monitor voordat je een aanvraag in behandeling neemt - quotum kan vol zijn."`,
    bronnen: [
      { type: "Proces", titel: "Vergunningcheck short-stay" },
      { type: "Handboek", titel: "Handleiding Short Stay Monitor" },
      { type: "Contact", titel: "Marie van Dijk", extra: "shortstay@amsterdam.nl" }
    ]
  },
  {
    vraag: "Hoe vraag ik een monumentenvergunning aan?",
    keywords: ["monument", "monumenten", "erfgoed", "rijksmonument", "beschermd"],
    antwoord: `Bij monumenten in Amsterdam gelden speciale procedures:

**Monumentenvergunning procedure:**
1. Altijd vooroverleg met Bureau Monumenten Amsterdam (BMA)
2. Indienen via Omgevingsloket + hardcopy naar BMA
3. Doorlooptijd: minimaal 12 weken
4. Commissie voor Ruimtelijke Kwaliteit adviseert
5. Bij rijksmonument: ook RCE betrekken

**Belangrijke tip van Thomas de Wit:**
"In de grachtengordel NOOIT een vergunning verlenen zonder advies Bureau Monumenten, ook al lijkt het klein."`,
    bronnen: [
      { type: "Proces", titel: "Monumentenvergunning procedure" },
      { type: "Template", titel: "Monumentenvergunning rijksmonument" },
      { type: "Contact", titel: "Bureau Monumenten Amsterdam", extra: "monumenten@amsterdam.nl" }
    ]
  }
];

// Netwerk AI responses (cross-gemeente)
export const netwerkAIResponses: AIResponse[] = [
  {
    vraag: "Hoe gaan gemeenten om met short-stay vergunningen?",
    keywords: ["short-stay", "vakantieverhuur", "vergelijk", "gemeenten", "beleid"],
    antwoord: `De aanpak van short-stay verschilt sterk per gemeente. Hier is een overzicht:

**Amsterdam** (strengst)
- Quotumsysteem per wijk
- Zero-tolerance handhaving
- Registratieplicht via Mijn Amsterdam
- Template: "Vergunning short-stay" (78 downloads)

**Rotterdam**
- Minder streng dan Amsterdam
- Wel meldplicht
- Focus op overlastgebieden

**Utrecht**
- Vergunningplicht in binnenstad
- Buiten centrum: meldplicht

**Best practice:**
Amsterdam's aanpak met de Short Stay Monitor wordt door veel gemeenten als voorbeeld gezien.`,
    bronnen: [
      { type: "Beleid", titel: "Beleidsregels short stay - Amsterdam" },
      { type: "Template", titel: "Last onder dwangsom illegale verhuur - Amsterdam" },
      { type: "Handboek", titel: "Handleiding Short Stay Monitor - Amsterdam" }
    ]
  },
  {
    vraag: "Wat zijn best practices voor handhaving?",
    keywords: ["handhaving", "best practice", "toezicht", "dwangsom", "vergelijk"],
    antwoord: `Op basis van ervaringen van Fielders bij 156 gemeenten, deze best practices voor handhaving:

**1. Documentatie (alle gemeenten)**
- Altijd foto's maken bij constatering
- Datum/tijd/locatie vastleggen
- ToezichtApp gebruiken waar beschikbaar

**2. Communicatie**
- **Rotterdam:** Vooraankondiging altijd met perceelgegevens in aanhef
- **Amsterdam:** Zero-tolerance communiceren vooraf bij short-stay
- **Utrecht:** Altijd wettelijke termijn expliciet benoemen

**3. Doorlooptijden**
- Rotterdam: Binnen 48 uur rapport opmaken
- Amsterdam: Direct handhaven bij illegale verhuur
- Gemiddelde zienswijzetermijn: 2-4 weken

**Netwerk tip:**
"De Rotterdamse aanpak met het stoplichtmodel (groen-oranje-rood) voor prioritering wordt door steeds meer gemeenten overgenomen."`,
    bronnen: [
      { type: "Template", titel: "Vooraankondiging handhaving - Rotterdam", extra: "45 downloads" },
      { type: "Template", titel: "Last onder dwangsom illegale verhuur - Amsterdam", extra: "34 downloads" }
    ]
  },
  {
    vraag: "Vergelijk welstandsprocedures tussen gemeenten",
    keywords: ["welstand", "vergelijk", "commissie", "procedure", "gemeenten"],
    antwoord: `**Welstandsprocedures vergeleken:**

| Aspect | Rotterdam | Amsterdam | Utrecht |
|--------|-----------|-----------|---------|
| Commissie | 2x per maand | Wekelijks | 2x per maand |
| Indientermijn | 3 weken vooraf | 2 weken vooraf | 3 weken vooraf |
| Vooroverleg | Via email | Via BMA portal | Via afspraak |
| Spoedprocedure | Ja, via email | Ja, extra kosten | Nee |

**Opvallende verschillen:**

**Rotterdam**
- Streng op kleurgebruik centrum
- Welstandscommissie elke 2e en 4e donderdag
- Contact: welstand@rotterdam.nl

**Amsterdam**
- Bureau Monumenten altijd betrekken bij grachtengordel
- Commissie voor Ruimtelijke Kwaliteit adviseert
- Langste doorlooptijd (vaak 12+ weken bij monumenten)

**Utrecht**
- Relatief soepel buiten historische kern
- JOIN-systeem voor aanvragen

**Best practice:**
Rotterdam's welstandsformulier op SharePoint wordt vaak als voorbeeld genoemd voor efficiente afhandeling.`,
    bronnen: [
      { type: "Proces", titel: "Welstandstoets aanvragen - Rotterdam" },
      { type: "Beleid", titel: "Welstandsnota Rotterdam 2023" },
      { type: "Beleid", titel: "Welstandsnota De Schoonheid van Amsterdam" }
    ]
  }
];

// Helper function to find matching response
export function findAIResponse(vraag: string, responses: AIResponse[]): AIResponse | null {
  const vraagLower = vraag.toLowerCase();

  for (const response of responses) {
    // Check if any keyword matches
    const hasMatch = response.keywords.some(keyword =>
      vraagLower.includes(keyword.toLowerCase())
    );

    if (hasMatch) {
      return response;
    }
  }

  return null;
}

// Default response when no match
export const defaultAIResponse: AIResponse = {
  vraag: "",
  keywords: [],
  antwoord: `Ik heb geen specifiek antwoord gevonden op deze vraag in de beschikbare kennisbank.

**Suggesties:**
- Probeer een andere zoekterm
- Bekijk de relevante processen en templates
- Neem contact op met een collega via de contactenlijst

Kan ik je ergens anders mee helpen?`,
  bronnen: []
};
