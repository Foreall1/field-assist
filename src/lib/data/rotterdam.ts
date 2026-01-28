// Rotterdam FIELD intern content

import { GemeenteContent, OpenbaarBeleid } from './types';

export const rotterdamContent: GemeenteContent = {
  processen: [
    {
      id: 1,
      titel: "Intake aanvraag omgevingsvergunning",
      beschrijving: "Stap-voor-stap proces voor het beoordelen van binnenkomende aanvragen",
      stappen: [
        "Aanvraag binnenkomt via Squit (zaaksysteem)",
        "Binnen 2 werkdagen: ontvankelijkheidscheck door frontoffice",
        "Toewijzing aan behandelaar op basis van complexiteit (A/B/C)",
        "Bij categorie C: direct doorzetten naar senior vergunningverlener",
        "Startgesprek inplannen binnen 5 werkdagen"
      ],
      auteur: "Lisa de Vries",
      datum: "2024-12-15",
      downloads: 34,
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Welstandstoets aanvragen",
      beschrijving: "Hoe en wanneer je een welstandsadvies aanvraagt",
      stappen: [
        "Check eerst welstandsnota: valt aanvraag in welstandsvrij gebied?",
        "Zo niet: welstandsformulier invullen via SharePoint",
        "Minimaal 3 weken voor gewenste vergaderdatum indienen",
        "Commissie vergadert elke 2e en 4e donderdag",
        "Bij spoed: mail naar welstand@rotterdam.nl met urgentie"
      ],
      auteur: "Mark Jansen",
      datum: "2024-11-28",
      downloads: 28,
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Handhavingstraject opstarten",
      beschrijving: "Proces van constatering tot last onder dwangsom",
      stappen: [
        "Constatering vastleggen in ToezichtApp met foto's",
        "Binnen 48 uur: rapport opmaken in Squit",
        "Vooraankondiging versturen (standaard template)",
        "Zienswijze termijn: 2 weken",
        "Bij geen reactie: voornemen last onder dwangsom",
        "Collegemandaat aanvragen via teamleider"
      ],
      auteur: "Pieter de Groot",
      datum: "2024-10-03",
      downloads: 19,
      vakgroep: "VTH"
    }
  ],

  templates: [
    {
      id: 1,
      titel: "Besluit weigering omgevingsvergunning",
      beschrijving: "Standaard weigeringsbesluit aangepast aan Rotterdamse eisen",
      bestandstype: "DOCX",
      versie: "3.2",
      auteur: "Lisa de Vries",
      datum: "2024-12-01",
      downloads: 67,
      tip: "Let op: Rotterdam wil de welstandsparagraaf altijd als aparte bijlage",
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Vooraankondiging handhaving",
      beschrijving: "Brief voorafgaand aan handhavingsbesluit",
      bestandstype: "DOCX",
      versie: "2.1",
      auteur: "Pieter de Groot",
      datum: "2024-09-15",
      downloads: 45,
      tip: "Juridische zaken wil dat je altijd de perceelgegevens in de aanhef noemt",
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Conceptvergunning dakkapel",
      beschrijving: "Specifiek voor dakkapellen in beschermd stadsgezicht",
      bestandstype: "DOCX",
      versie: "1.4",
      auteur: "Anna Bakker",
      datum: "2024-11-20",
      downloads: 23,
      tip: "In centrum altijd de monumentencommissie CC'en",
      vakgroep: "VTH"
    },
    {
      id: 4,
      titel: "Checklist ontvankelijkheid",
      beschrijving: "Volledige checklist voor ontvankelijkheidstoets",
      bestandstype: "XLSX",
      versie: "4.0",
      auteur: "Mark Jansen",
      datum: "2024-12-10",
      downloads: 89,
      tip: null,
      vakgroep: "VTH"
    }
  ],

  handboeken: [
    {
      id: 1,
      titel: "Werkinstructie Squit",
      beschrijving: "Complete handleiding voor het zaaksysteem",
      paginas: 34,
      auteur: "Beheer Team",
      datum: "2024-08-01",
      downloads: 56
    },
    {
      id: 2,
      titel: "Mandaatregeling VTH Rotterdam",
      beschrijving: "Wie mag wat besluiten - overzicht mandaten",
      paginas: 12,
      auteur: "Juridische Zaken",
      datum: "2024-06-15",
      downloads: 41
    }
  ],

  contacten: [
    {
      id: 1,
      naam: "Jan van den Berg",
      functie: "Teamleider Vergunningen",
      telefoon: "06-12345678",
      email: "j.vandenberg@rotterdam.nl",
      wanneerBenaderen: "Complexe zaken, collegebesluiten, escalaties",
      toegevoegdDoor: "Lisa de Vries"
    },
    {
      id: 2,
      naam: "Sandra Visser",
      functie: "Juridisch adviseur",
      telefoon: "06-87654321",
      email: "s.visser@rotterdam.nl",
      wanneerBenaderen: "Juridische vragen, bezwaar & beroep, Bibob",
      toegevoegdDoor: "Mark Jansen"
    },
    {
      id: 3,
      naam: "Kees de Koning",
      functie: "Secretaris Welstandscommissie",
      telefoon: "010-1234567",
      email: "welstand@rotterdam.nl",
      wanneerBenaderen: "Spoedaanvragen welstand, vragen over welstandsnota",
      toegevoegdDoor: "Anna Bakker"
    }
  ],

  tips: [
    {
      id: 1,
      tekst: "Bij Rotterdam altijd eerst checken of het perceel in het Nationaal Programma Rotterdam Zuid valt - daar gelden andere procedures.",
      auteur: "Lisa de Vries",
      datum: "2024-12-14",
      likes: 12
    },
    {
      id: 2,
      tekst: "De welstandscommissie is streng op kleurgebruik in het centrum. Vraag bij twijfel altijd vooraf een vooroverleg aan.",
      auteur: "Mark Jansen",
      datum: "2024-11-30",
      likes: 8
    },
    {
      id: 3,
      tekst: "Squit logt je automatisch uit na 30 min inactiviteit. Sla tussendoor op!",
      auteur: "Anna Bakker",
      datum: "2024-10-22",
      likes: 23
    }
  ]
};

export const rotterdamBeleid: OpenbaarBeleid[] = [
  {
    titel: "Omgevingsplan Rotterdam",
    type: "Omgevingsplan",
    link: "#",
    laatstGewijzigd: "2024-01-01"
  },
  {
    titel: "Welstandsnota Rotterdam 2023",
    type: "Welstandsbeleid",
    link: "#",
    laatstGewijzigd: "2023-06-15"
  },
  {
    titel: "Beleidsregels parkeren",
    type: "Beleidsregel",
    link: "#",
    laatstGewijzigd: "2024-03-01"
  },
  {
    titel: "Handhavingsbeleid fysieke leefomgeving",
    type: "Beleidsregel",
    link: "#",
    laatstGewijzigd: "2023-09-01"
  }
];
