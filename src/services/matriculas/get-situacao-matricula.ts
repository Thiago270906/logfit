export const MATRICULA_SITUACOES = [
  "aguardando_assinatura",
  "ativa",
  "expirada",
  "cancelada",
] as const;

export type MatriculaSituacao = (typeof MATRICULA_SITUACOES)[number];

// Situação é calculada, não armazenada: o `status` da matrícula só
// controla o fluxo de assinatura/cancelamento; a expiração depende apenas de
// `dataExpiracao` ter passado ou não em relação a agora.
export function getSituacaoMatricula(
  status: string,
  dataExpiracao: Date | string | null,
): MatriculaSituacao {
  if (status === "cancelada") return "cancelada";
  if (status !== "assinada") return "aguardando_assinatura";
  if (dataExpiracao && new Date(dataExpiracao).getTime() < Date.now()) {
    return "expirada";
  }
  return "ativa";
}
