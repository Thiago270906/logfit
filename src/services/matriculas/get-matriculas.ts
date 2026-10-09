import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";
import { plano } from "@/lib/db/plano-schema";

export async function getMatriculas() {
  return getDb()
    .select({
      id: matricula.id,
      status: matricula.status,
      periodicidade: matricula.periodicidade,
      token: matricula.token,
      assinaturaNome: matricula.assinaturaNome,
      assinadoEm: matricula.assinadoEm,
      createdAt: matricula.createdAt,
      alunoNome: aluno.nome,
      planoNome: plano.nome,
    })
    .from(matricula)
    .innerJoin(aluno, eq(matricula.alunoId, aluno.id))
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .orderBy(desc(matricula.createdAt));
}
