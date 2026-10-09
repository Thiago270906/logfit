import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";
import { plano } from "@/lib/db/plano-schema";

export async function getMatriculaById(id: string) {
  const [row] = await getDb()
    .select({
      id: matricula.id,
      status: matricula.status,
      periodicidade: matricula.periodicidade,
      token: matricula.token,
      assinaturaNome: matricula.assinaturaNome,
      assinadoEm: matricula.assinadoEm,
      createdAt: matricula.createdAt,
      alunoNome: aluno.nome,
      alunoTelefone: aluno.telefone,
      planoNome: plano.nome,
    })
    .from(matricula)
    .innerJoin(aluno, eq(matricula.alunoId, aluno.id))
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(eq(matricula.id, id))
    .limit(1);

  return row;
}
