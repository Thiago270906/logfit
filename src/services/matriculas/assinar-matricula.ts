import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaInput,
} from "@/lib/validations/matricula";

export async function assinarMatricula(
  token: string,
  input: AssinarMatriculaInput,
) {
  const data = assinarMatriculaSchema.parse(input);

  const [pendente] = await getDb()
    .select({ id: matricula.id })
    .from(matricula)
    .where(
      and(
        eq(matricula.token, token),
        eq(matricula.status, "aguardando_assinatura"),
      ),
    )
    .limit(1);

  if (!pendente) return undefined;

  const assinadoEm = new Date();

  const [updated] = await getDb()
    .update(matricula)
    .set({
      status: "assinada",
      assinaturaNome: data.nome,
      assinadoEm,
    })
    .where(eq(matricula.id, pendente.id))
    .returning();

  await getDb().insert(matriculaHistorico).values({
    matriculaId: pendente.id,
    tipo: "assinada",
    descricao: `Contrato assinado digitalmente por ${data.nome}.`,
  });

  return updated;
}
