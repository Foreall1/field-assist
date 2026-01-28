// Amsterdam FIELD intern content

import { GemeenteContent, OpenbaarBeleid } from './types';

export const amsterdamContent: GemeenteContent = {
  processen: [
    {
      id: 1,
      titel: "Vergunningcheck short-stay",
      beschrijving: "Specifiek proces voor short-stay/vakantieverhuur aanvragen",
      stappen: [
        "Check quotum wijk via Short Stay Monitor",
        "Controleer of pand in verboden gebied ligt",
        "Aanvraag via Mijn Amsterdam portal",
        "Automatische check op WOZ en eigendom",
        "Bij goedkeuring: registratienummer binnen 5 werkdagen"
      ],
      auteur: "Sophie Bakker",
      datum: "2024-12-08",
      downloads: 56,
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Monumentenvergunning procedure",
      beschrijving: "Stappen voor vergunning rijks- en gemeentelijke monumenten",
      stappen: [
        "Altijd vooroverleg met Bureau Monumenten",
        "Indienen via Omgevingsloket + hardcopy naar BMA",
        "Doorlooptijd: minimaal 12 weken",
        "Commissie voor Ruimtelijke Kwaliteit adviseert",
        "Bij rijksmonument: ook RCE betrekken"
      ],
      auteur: "Thomas de Wit",
      datum: "2024-11-15",
      downloads: 42,
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Handhaving woonfraude",
      beschrijving: "Proces bij illegale vakantieverhuur of woningonttrekking",
      stappen: [
        "Melding/signaal binnengekomen via meldpunt",
        "Controle via Toeristenheffing data",
        "Huisbezoek inplannen met toezichthouder",
        "Bij constatering: rapport + foto's",
        "Direct vooraankondiging dwangsom versturen"
      ],
      auteur: "Peter Smit",
      datum: "2024-10-25",
      downloads: 38,
      vakgroep: "VTH"
    }
  ],

  templates: [
    {
      id: 1,
      titel: "Vergunning short-stay verhuur",
      beschrijving: "Standaard vergunning voor vakantieverhuur",
      bestandstype: "DOCX",
      versie: "2.3",
      auteur: "Sophie Bakker",
      datum: "2024-12-01",
      downloads: 78,
      tip: "Amsterdam eist altijd het registratienummer in de beschikking",
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Last onder dwangsom illegale verhuur",
      beschrijving: "Handhavingsbesluit specifiek voor illegale vakantieverhuur",
      bestandstype: "DOCX",
      versie: "3.1",
      auteur: "Peter Smit",
      datum: "2024-10-20",
      downloads: 34,
      tip: "Dwangsombedragen liggen vast in de Handhavingsstrategie Woonfraude",
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Monumentenvergunning rijksmonument",
      beschrijving: "Template specifiek voor rijksmonumenten in Amsterdam",
      bestandstype: "DOCX",
      versie: "2.0",
      auteur: "Thomas de Wit",
      datum: "2024-09-10",
      downloads: 29,
      tip: "RCE advies altijd bijvoegen als bijlage",
      vakgroep: "VTH"
    },
    {
      id: 4,
      titel: "Weigering woningonttrekking",
      beschrijving: "Besluit voor weigering onttrekkingsvergunning",
      bestandstype: "DOCX",
      versie: "1.5",
      auteur: "Sophie Bakker",
      datum: "2024-11-05",
      downloads: 18,
      tip: null,
      vakgroep: "VTH"
    }
  ],

  handboeken: [
    {
      id: 1,
      titel: "Handleiding Short Stay Monitor",
      beschrijving: "Gebruik van het quotumsysteem voor vakantieverhuur",
      paginas: 22,
      auteur: "Team Short Stay",
      datum: "2024-06-01",
      downloads: 67
    },
    {
      id: 2,
      titel: "Werkwijze Bureau Monumenten Amsterdam",
      beschrijving: "Procedures en contactmomenten met BMA",
      paginas: 18,
      auteur: "Thomas de Wit",
      datum: "2024-04-15",
      downloads: 45
    },
    {
      id: 3,
      titel: "Handhavingsstrategie Woonfraude 2024",
      beschrijving: "Beleid en dwangsombedragen voor woonfraude",
      paginas: 28,
      auteur: "Juridische Zaken",
      datum: "2024-01-10",
      downloads: 52
    }
  ],

  contacten: [
    {
      id: 1,
      naam: "Marie van Dijk",
      functie: "Coordinator Short Stay",
      telefoon: "06-11223344",
      email: "shortstay@amsterdam.nl",
      wanneerBenaderen: "Alle vragen over vakantieverhuur en short stay",
      toegevoegdDoor: "Sophie Bakker"
    },
    {
      id: 2,
      naam: "Bureau Monumenten Amsterdam",
      functie: "Adviesbureau",
      telefoon: "020-1234567",
      email: "monumenten@amsterdam.nl",
      wanneerBenaderen: "Vooroverleg monumenten, advies rijksmonumenten",
      toegevoegdDoor: "Thomas de Wit"
    },
    {
      id: 3,
      naam: "Handhavingsteam Woonfraude",
      functie: "Toezicht & Handhaving",
      telefoon: "020-7654321",
      email: "woonfraude@amsterdam.nl",
      wanneerBenaderen: "Meldingen illegale verhuur, gezamenlijke controles",
      toegevoegdDoor: "Peter Smit"
    }
  ],

  tips: [
    {
      id: 1,
      tekst: "Amsterdam heeft een zero-tolerance beleid op illegale vakantieverhuur. Altijd direct handhaven bij constatering.",
      auteur: "Peter Smit",
      datum: "2024-12-10",
      likes: 15
    },
    {
      id: 2,
      tekst: "In de grachtengordel NOOIT een vergunning verlenen zonder advies Bureau Monumenten, ook al lijkt het klein.",
      auteur: "Thomas de Wit",
      datum: "2024-11-25",
      likes: 19
    },
    {
      id: 3,
      tekst: "Check altijd de Short Stay Monitor voordat je een aanvraag in behandeling neemt - quotum kan vol zijn.",
      auteur: "Sophie Bakker",
      datum: "2024-12-05",
      likes: 11
    }
  ]
};

export const amsterdamBeleid: OpenbaarBeleid[] = [
  {
    titel: "Omgevingsplan Amsterdam",
    type: "Omgevingsplan",
    link: "#",
    laatstGewijzigd: "2024-01-01"
  },
  {
    titel: "Welstandsnota De Schoonheid van Amsterdam",
    type: "Welstandsbeleid",
    link: "#",
    laatstGewijzigd: "2022-12-01"
  },
  {
    titel: "Beleidsregels short stay",
    type: "Beleidsregel",
    link: "#",
    laatstGewijzigd: "2024-06-01"
  },
  {
    titel: "Erfgoedverordening Amsterdam",
    type: "Verordening",
    link: "#",
    laatstGewijzigd: "2023-03-15"
  }
];
