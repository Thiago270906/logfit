import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";

export async function getMatriculaHistorico(matriculaId: string) {
  return getDb()
    .select({
      id: matriculaHistorico.id,
      tipo: matriculaHistorico.tipo,
      descricao: matriculaHistorico.descricao,
      createdAt: matriculaHistorico.createdAt,
    })
    .from(matriculaHistorico)
    .where(eq(matriculaHistorico.matriculaId, matriculaId))
    .orderBy(asc(matriculaHistorico.createdAt));
}
