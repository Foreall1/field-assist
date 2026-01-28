// Gemeenten data voor FIELD Assist

export interface Gemeente {
  id: string;
  naam: string;
  provincie: string;
  inwoners: number;
  actieveFielders: number;
  totaleBijdragen: number;
  laatsteUpdate: string;
  color: string;
}

export const gemeenten: Gemeente[] = [
  {
    id: "rotterdam",
    naam: "Rotterdam",
    provincie: "Zuid-Holland",
    inwoners: 655000,
    actieveFielders: 8,
    totaleBijdragen: 47,
    laatsteUpdate: "2 uur geleden",
    color: "#288978"
  },
  {
    id: "amsterdam",
    naam: "Amsterdam",
    provincie: "Noord-Holland",
    inwoners: 882000,
    actieveFielders: 12,
    totaleBijdragen: 63,
    laatsteUpdate: "30 min geleden",
    color: "#E63946"
  },
  {
    id: "utrecht",
    naam: "Utrecht",
    provincie: "Utrecht",
    inwoners: 361000,
    actieveFielders: 5,
    totaleBijdragen: 31,
    laatsteUpdate: "1 dag geleden",
    color: "#1D3557"
  },
  {
    id: "arnhem",
    naam: "Arnhem",
    provincie: "Gelderland",
    inwoners: 164000,
    actieveFielders: 4,
    totaleBijdragen: 22,
    laatsteUpdate: "3 uur geleden",
    color: "#F4A261"
  }
];

export const netwerkStats = {
  totaalGemeenten: 156,
  totaalOmgevingsdiensten: 12,
  totaalDocumenten: 847,
  totaalDownloads: 3247,
  actieveFielders: 158,
  bijdragenDezeWeek: 23
};

export function getGemeente(id: string): Gemeente | undefined {
  return gemeenten.find(g => g.id === id);
}

export function zoekGemeenten(query: string): Gemeente[] {
  const q = query.toLowerCase();
  return gemeenten.filter(g =>
    g.naam.toLowerCase().includes(q) ||
    g.provincie.toLowerCase().includes(q)
  );
}
