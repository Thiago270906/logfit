import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import { temMatriculaAtiva } from "@/services/matriculas/tem-matricula-ativa";

export const PRAZO_REABERTURA_DIAS = 10;

export class MatriculaNaoCanceladaError extends Error {
  constructor() {
    super("Esta matrícula não está cancelada.");
    this.name = "MatriculaNaoCanceladaError";
  }
}

export class PrazoReaberturaExpiradoError extends Error {
  constructor() {
    super(
      `O prazo de ${PRAZO_REABERTURA_DIAS} dias para reabrir esta matrícula já expirou.`,
    );
    this.name = "PrazoReaberturaExpiradoError";
  }
}

export class MatriculaAtivaAoReabrirError extends Error {
  constructor() {
    super(
      "Este aluno já possui outra matrícula ativa, não é possível reabrir.",
    );
    this.name = "MatriculaAtivaAoReabrirError";
  }
}

// Usado pela UI para decidir se mostra a opção de reabrir, sem duplicar
// a regra do prazo que é validada de novo (e com mais força) no server.
export function podeReabrirMatricula(
  status: string,
  canceladaEm: Date | string | null,
) {
  if (status !== "cancelada" || !canceladaEm) return false;

  const limite = new Date(canceladaEm);
  limite.setDate(limite.getDate() + PRAZO_REABERTURA_DIAS);
  return Date.now() <= limite.getTime();
}

// Dentro do prazo, cancelar é reversível: reabrir devolve a matrícula
// exatamente ao status anterior ao cancelamento (assinada ou aguardando
// assinatura), sem alterar datas, assinatura ou pagamentos já gerados.
export async function reabrirMatricula(id: string) {
  const db = getDb();

  const [atual] = await db
    .select({
      alunoId: matricula.alunoId,
      status: matricula.status,
      assinadoEm: matricula.assinadoEm,
      canceladaEm: matricula.canceladaEm,
    })
    .from(matricula)
    .where(eq(matricula.id, id))
    .limit(1);

  if (!atual) return null;
  if (atual.status !== "cancelada" || !atual.canceladaEm) {
    throw new MatriculaNaoCanceladaError();
  }

  const limite = new Date(atual.canceladaEm);
  limite.setDate(limite.getDate() + PRAZO_REABERTURA_DIAS);
  if (Date.now() > limite.getTime()) {
    throw new PrazoReaberturaExpiradoError();
  }

  if (await temMatriculaAtiva(atual.alunoId)) {
    throw new MatriculaAtivaAoReabrirError();
  }

  const [atualizada] = await db
    .update(matricula)
    .set({
      status: atual.assinadoEm ? "assinada" : "aguardando_assinatura",
      canceladaEm: null,
    })
    .where(eq(matricula.id, id))
    .returning();

  await db.insert(matriculaHistorico).values({
    matriculaId: id,
    tipo: "reaberta",
    descricao: "Matrícula reaberta dentro do prazo de cancelamento.",
  });

  return atualizada;
}
