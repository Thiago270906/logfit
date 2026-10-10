import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";
import { plano } from "@/lib/db/plano-schema";

export async function getMatriculaByToken(token: string) {
  const [row] = await getDb()
    .select({
      id: matricula.id,
      status: matricula.status,
      periodicidade: matricula.periodicidade,
      anamnese: matricula.anamnese,
      assinaturaNome: matricula.assinaturaNome,
      assinaturaImagem: matricula.assinaturaImagem,
      assinadoEm: matricula.assinadoEm,
      dataInicio: matricula.dataInicio,
      dataExpiracao: matricula.dataExpiracao,
      createdAt: matricula.createdAt,
      aluno,
      plano,
    })
    .from(matricula)
    .innerJoin(aluno, eq(matricula.alunoId, aluno.id))
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(eq(matricula.token, token))
    .limit(1);

  return row;
}
