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

export function sugerirDataVencimento(
  periodicidade: PeriodicidadeKey,
  dataInicio: Date,
) {
  const data = new Date(dataInicio);
  if (periodicidade === "diaria") data.setDate(data.getDate() + 1);
  if (periodicidade === "mensal") data.setMonth(data.getMonth() + 1);
  if (periodicidade === "anual") data.setFullYear(data.getFullYear() + 1);
  return data;
}
