import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";

export async function getMatriculaStatus(id: string) {
  const [row] = await getDb()
    .select({
      status: matricula.status,
      assinaturaNome: matricula.assinaturaNome,
      assinadoEm: matricula.assinadoEm,
      dataExpiracao: matricula.dataExpiracao,
    })
    .from(matricula)
    .where(eq(matricula.id, id))
    .limit(1);

  return row;
}
