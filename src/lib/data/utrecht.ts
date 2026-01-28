// Utrecht FIELD intern content

import { GemeenteContent, OpenbaarBeleid } from './types';

export const utrechtContent: GemeenteContent = {
  processen: [
    {
      id: 1,
      titel: "Omgevingsvergunning bouwactiviteit",
      beschrijving: "Standaardproces voor reguliere bouwaanvragen",
      stappen: [
        "Ontvangst via Omgevingsloket \u2192 automatisch in JOIN",
        "Ontvankelijkheidscheck binnen 3 werkdagen",
        "Uitzetten naar vakspecialisten via Loopio",
        "Coordinatiemoment elke dinsdag 10:00",
        "Besluit via teamleider bij mandaat A"
      ],
      auteur: "Henk Pietersen",
      datum: "2024-11-20",
      downloads: 29,
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Vooroverleg aanvragen",
      beschrijving: "Proces voor conceptaanvragen en schetsplannen",
      stappen: [
        "Aanvraag via e-mail of Omgevingsloket",
        "Registratie in JOIN als vooroverleg",
        "Intern uitzetten binnen 5 werkdagen",
        "Gesprek inplannen met aanvrager",
        "Schriftelijk advies binnen 4 weken"
      ],
      auteur: "Els de Jong",
      datum: "2024-10-15",
      downloads: 22,
      vakgroep: "VTH"
    }
  ],

  templates: [
    {
      id: 1,
      titel: "Ontvangstbevestiging met checklist",
      beschrijving: "Brief bij incomplete aanvraag met ontbrekende stukken",
      bestandstype: "DOCX",
      versie: "1.8",
      auteur: "Henk Pietersen",
      datum: "2024-10-15",
      downloads: 38,
      tip: "Utrecht wil altijd dat je de wettelijke termijn expliciet benoemt",
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Vergunning eenvoudige bouwactiviteit",
      beschrijving: "Template voor categorie A vergunningen",
      bestandstype: "DOCX",
      versie: "2.3",
      auteur: "Els de Jong",
      datum: "2024-09-20",
      downloads: 31,
      tip: "Controleer altijd de exacte kadastrale gegevens - Utrecht is hier streng op",
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Advies vooroverleg",
      beschrijving: "Standaard adviesbrief na vooroverleg",
      bestandstype: "DOCX",
      versie: "1.2",
      auteur: "Henk Pietersen",
      datum: "2024-11-01",
      downloads: 19,
      tip: null,
      vakgroep: "VTH"
    }
  ],

  handboeken: [
    {
      id: 1,
      titel: "Werkinstructie JOIN",
      beschrijving: "Handleiding voor het zaaksysteem JOIN",
      paginas: 28,
      auteur: "Applicatiebeheer",
      datum: "2024-05-01",
      downloads: 44
    },
    {
      id: 2,
      titel: "Loopio werkwijze Utrecht",
      beschrijving: "Hoe werkt het uitzetproces via Loopio",
      paginas: 15,
      auteur: "Henk Pietersen",
      datum: "2024-07-20",
      downloads: 33
    }
  ],

  contacten: [
    {
      id: 1,
      naam: "Els de Jong",
      functie: "Senior vergunningverlener",
      telefoon: "06-55667788",
      email: "e.dejong@utrecht.nl",
      wanneerBenaderen: "Complexe bouwplannen, afwijkingen bestemmingsplan",
      toegevoegdDoor: "Henk Pietersen"
    },
    {
      id: 2,
      naam: "Willem Bakker",
      functie: "Coordinator Welstand",
      telefoon: "030-2861234",
      email: "welstand@utrecht.nl",
      wanneerBenaderen: "Welstandsvragen, commissievergaderingen",
      toegevoegdDoor: "Els de Jong"
    }
  ],

  tips: [
    {
      id: 1,
      tekst: "Utrecht wijst ALTIJD tekeningen af zonder maatvoering. Check dit als eerste.",
      auteur: "Henk Pietersen",
      datum: "2024-12-05",
      likes: 11
    },
    {
      id: 2,
      tekst: "Het Loopio coordinatiemoment is heilig - zorg dat je vragen daar stelt, niet via losse mails.",
      auteur: "Els de Jong",
      datum: "2024-11-18",
      likes: 7
    }
  ]
};

export const utrechtBeleid: OpenbaarBeleid[] = [
  {
    titel: "Omgevingsplan Utrecht",
    type: "Omgevingsplan",
    link: "#",
    laatstGewijzigd: "2024-01-01"
  },
  {
    titel: "Welstandsnota Utrecht",
    type: "Welstandsbeleid",
    link: "#",
    laatstGewijzigd: "2023-09-01"
  },
  {
    titel: "Beleidsregels afwijken omgevingsplan",
    type: "Beleidsregel",
    link: "#",
    laatstGewijzigd: "2024-02-15"
  }
];
