export const PERIODICIDADE_KEYS = [
  "diaria",
  "mensal",
  "bimestral",
  "trimestral",
  "quadrimestral",
  "semestral",
  "anual",
] as const;

export type PeriodicidadeKey = (typeof PERIODICIDADE_KEYS)[number];

// "meses" é null para "diaria": não tem equivalência em meses, nunca entra
// no fluxo de renovação/rematrícula.
export const PERIODICIDADES: {
  key: PeriodicidadeKey;
  label: string;
  meses: number | null;
}[] = [
  { key: "diaria", label: "Diária", meses: null },
  { key: "mensal", label: "Mensal", meses: 1 },
  { key: "bimestral", label: "Bimestral", meses: 2 },
  { key: "trimestral", label: "Trimestral", meses: 3 },
  { key: "quadrimestral", label: "Quadrimestral", meses: 4 },
  { key: "semestral", label: "Semestral", meses: 6 },
  { key: "anual", label: "Anual", meses: 12 },
];

// Periodicidades elegíveis para rematrícula automática (lazy trigger em
// gerar-mensalidades-pendentes.ts). As demais (diária e as novas:
// bimestral/trimestral/quadrimestral/semestral) sempre passam pela
// confirmação manual do admin em "Confirmar rematrícula".
export const PERIODICIDADES_COM_RENOVACAO_AUTOMATICA: PeriodicidadeKey[] = [
  "mensal",
  "anual",
];

export function mesesDaPeriodicidade(periodicidade: PeriodicidadeKey) {
  return PERIODICIDADES.find(({ key }) => key === periodicidade)?.meses ?? null;
}

const SUFIXOS_COBRANCA: Record<PeriodicidadeKey, string> = {
  diaria: "por dia",
  mensal: "por mês",
  bimestral: "por bimestre",
  trimestral: "por trimestre",
  quadrimestral: "por quadrimestre",
  semestral: "por semestre",
  anual: "por ano",
};

export function sufixoCobranca(periodicidade: PeriodicidadeKey) {
  return SUFIXOS_COBRANCA[periodicidade];
}

export function labelDuracao(periodicidade: PeriodicidadeKey) {
  if (periodicidade === "diaria") return "1 dia";
  const meses = mesesDaPeriodicidade(periodicidade) ?? 1;
  return meses === 1 ? "1 mês" : `${meses} meses`;
}

export function sugerirDataVencimento(
  periodicidade: PeriodicidadeKey,
  dataInicio: Date,
) {
  const data = new Date(dataInicio);
  const meses = mesesDaPeriodicidade(periodicidade);

  if (meses === null) {
    data.setDate(data.getDate() + 1);
  } else {
    data.setMonth(data.getMonth() + meses);
  }

  return data;
}
