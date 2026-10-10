import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { plano } from "@/lib/db/plano-schema";

export async function getMatriculasByAluno(alunoId: string) {
  return getDb()
    .select({
      id: matricula.id,
      status: matricula.status,
      periodicidade: matricula.periodicidade,
      dataExpiracao: matricula.dataExpiracao,
      createdAt: matricula.createdAt,
      planoNome: plano.nome,
    })
    .from(matricula)
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(eq(matricula.alunoId, alunoId))
    .orderBy(desc(matricula.createdAt));
}
