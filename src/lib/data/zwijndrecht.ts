// Zwijndrecht FIELD intern content

import { GemeenteContent, OpenbaarBeleid } from './types';

export const zwijndrechtContent: GemeenteContent = {
  processen: [
    {
      id: 1,
      titel: "Omgevingsvergunning aanvragen",
      beschrijving: "Stapsgewijs proces voor het behandelen van omgevingsvergunningen",
      stappen: [
        "Aanvraag binnengekomen via Omgevingsloket",
        "Ontvankelijkheidstoets binnen 2 weken",
        "Toewijzing aan behandelaar",
        "Inhoudelijke beoordeling (toets aan omgevingsplan en Bbl)",
        "Eventueel advies welstandscommissie aanvragen",
        "Besluit binnen 8 weken (reguliere procedure)"
      ],
      auteur: "VTH-team Zwijndrecht",
      datum: "2024-12-01",
      downloads: 15,
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Handhavingsverzoek behandelen",
      beschrijving: "Proces voor het afhandelen van handhavingsverzoeken van burgers",
      stappen: [
        "Handhavingsverzoek ontvangen en registreren",
        "Ontvangstbevestiging binnen 1 week",
        "Toezichthouder voert controle uit",
        "Beoordeling of sprake is van overtreding",
        "Bij overtreding: vooraankondiging handhaving",
        "Besluit binnen 8 weken"
      ],
      auteur: "Handhaving Zwijndrecht",
      datum: "2024-11-15",
      downloads: 8,
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Bouwmelding Wkb verwerken",
      beschrijving: "Proces voor het verwerken van bouwmeldingen onder de Wet kwaliteitsborging",
      stappen: [
        "Bouwmelding ontvangen (4 weken voor start bouw)",
        "Controleer of melding compleet is",
        "Check kwaliteitsborger in landelijk register",
        "Registreer in zaaksysteem",
        "Informeer toezicht over geplande bouwactiviteit",
        "Na gereedmelding: dossier bevoegd gezag controleren"
      ],
      auteur: "VTH-team Zwijndrecht",
      datum: "2024-10-20",
      downloads: 12,
      vakgroep: "VTH"
    }
  ],

  templates: [
    {
      id: 1,
      titel: "Besluit omgevingsvergunning",
      beschrijving: "Standaard besluitdocument voor verlenen omgevingsvergunning",
      bestandstype: "DOCX",
      versie: "2.0",
      auteur: "VTH-team",
      datum: "2024-12-01",
      downloads: 23,
      tip: "Vergeet niet de voorschriften specifiek te maken voor het project",
      vakgroep: "VTH"
    },
    {
      id: 2,
      titel: "Vooraankondiging last onder dwangsom",
      beschrijving: "Brief voor het aankondigen van een voorgenomen last onder dwangsom",
      bestandstype: "DOCX",
      versie: "1.5",
      auteur: "Juridische zaken",
      datum: "2024-11-01",
      downloads: 18,
      tip: "Begunstigingstermijn afstemmen op aard van de overtreding",
      vakgroep: "VTH"
    },
    {
      id: 3,
      titel: "Checklist ontvankelijkheid bouwaanvraag",
      beschrijving: "Volledige checklist voor het toetsen van ontvankelijkheid",
      bestandstype: "XLSX",
      versie: "3.0",
      auteur: "VTH-team",
      datum: "2024-09-15",
      downloads: 31,
      tip: null,
      vakgroep: "VTH"
    },
    {
      id: 4,
      titel: "Weigeringsbesluit omgevingsvergunning",
      beschrijving: "Template voor het weigeren van een omgevingsvergunning",
      bestandstype: "DOCX",
      versie: "1.2",
      auteur: "Juridische zaken",
      datum: "2024-10-10",
      downloads: 9,
      tip: "Weigeringsgronden altijd concreet en specifiek formuleren",
      vakgroep: "VTH"
    }
  ],

  handboeken: [
    {
      id: 1,
      titel: "Handleiding Omgevingsloket",
      beschrijving: "Uitleg over het werken met het Omgevingsloket",
      paginas: 24,
      auteur: "VTH-team",
      datum: "2024-06-01",
      downloads: 19
    },
    {
      id: 2,
      titel: "Mandaatregeling VTH Zwijndrecht",
      beschrijving: "Overzicht van mandaten en bevoegdheden binnen VTH",
      paginas: 8,
      auteur: "Juridische zaken",
      datum: "2024-01-15",
      downloads: 14
    }
  ],

  contacten: [
    {
      id: 1,
      naam: "VTH-loket Zwijndrecht",
      functie: "Algemeen contactpunt",
      telefoon: "078-770 8000",
      email: "vth@zwijndrecht.nl",
      wanneerBenaderen: "Algemene vragen over vergunningen en handhaving",
      toegevoegdDoor: "Admin"
    },
    {
      id: 2,
      naam: "Teamleider Vergunningen",
      functie: "Teamleider",
      telefoon: "078-770 8001",
      email: "vergunningen@zwijndrecht.nl",
      wanneerBenaderen: "Complexe aanvragen, escalaties, principiële vragen",
      toegevoegdDoor: "Admin"
    }
  ],

  tips: [
    {
      id: 1,
      tekst: "Bij twijfel over vergunningplicht: gebruik de vergunningcheck op het Omgevingsloket. Dit voorkomt onnodige aanvragen.",
      auteur: "VTH-team",
      datum: "2024-12-01",
      likes: 5
    },
    {
      id: 2,
      tekst: "Vooroverleg aanvragen bespaart tijd. De gemeente geeft dan aan of het plan past binnen het omgevingsplan.",
      auteur: "VTH-team",
      datum: "2024-11-15",
      likes: 8
    },
    {
      id: 3,
      tekst: "Bij Wkb-meldingen altijd checken of de kwaliteitsborger staat ingeschreven in het landelijk register.",
      auteur: "VTH-team",
      datum: "2024-10-01",
      likes: 3
    }
  ]
};

export const zwijndrechtBeleid: OpenbaarBeleid[] = [
  {
    titel: "Omgevingsplan Zwijndrecht",
    type: "Omgevingsplan",
    link: "https://www.ruimtelijkeplannen.nl",
    laatstGewijzigd: "2024-01-01"
  },
  {
    titel: "Welstandsnota Zwijndrecht",
    type: "Welstandsbeleid",
    link: "https://www.zwijndrecht.nl/welstand",
    laatstGewijzigd: "2023-06-01"
  },
  {
    titel: "Handhavingsbeleid fysieke leefomgeving",
    type: "Beleidsregel",
    link: "https://www.zwijndrecht.nl/handhaving",
    laatstGewijzigd: "2023-09-15"
  },
  {
    titel: "Legesverordening 2024",
    type: "Verordening",
    link: "https://www.zwijndrecht.nl/leges",
    laatstGewijzigd: "2024-01-01"
  }
];
