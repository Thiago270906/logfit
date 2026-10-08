export const PERIODICIDADES = [
  {
    key: "diaria",
    label: "Diária",
    habilitadaField: "diariaHabilitada",
    valorField: "diariaValor",
  },
  {
    key: "mensal",
    label: "Mensal",
    habilitadaField: "mensalHabilitada",
    valorField: "mensalValor",
  },
  {
    key: "anual",
    label: "Anual",
    habilitadaField: "anualHabilitada",
    valorField: "anualValor",
  },
] as const;

export type PeriodicidadeKey = (typeof PERIODICIDADES)[number]["key"];
