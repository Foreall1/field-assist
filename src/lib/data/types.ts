// Types voor FIELD Assist gemeente content

export interface Proces {
  id: number;
  titel: string;
  beschrijving: string;
  stappen: string[];
  auteur: string;
  datum: string;
  downloads: number;
  vakgroep: string;
}

export interface Template {
  id: number;
  titel: string;
  beschrijving: string;
  bestandstype: "DOCX" | "PDF" | "XLSX";
  versie: string;
  auteur: string;
  datum: string;
  downloads: number;
  tip: string | null;
  vakgroep: string;
}

export interface Handboek {
  id: number;
  titel: string;
  beschrijving: string;
  paginas: number;
  auteur: string;
  datum: string;
  downloads: number;
}

export interface Contact {
  id: number;
  naam: string;
  functie: string;
  telefoon: string;
  email: string;
  wanneerBenaderen: string;
  toegevoegdDoor: string;
}

export interface Tip {
  id: number;
  tekst: string;
  auteur: string;
  datum: string;
  likes: number;
}

export interface OpenbaarBeleid {
  titel: string;
  type: string;
  link: string;
  laatstGewijzigd: string;
}

export interface GemeenteContent {
  processen: Proces[];
  templates: Template[];
  handboeken: Handboek[];
  contacten: Contact[];
  tips: Tip[];
}

export interface LandelijkeWet {
  titel: string;
  beschrijving: string;
  link: string;
}
