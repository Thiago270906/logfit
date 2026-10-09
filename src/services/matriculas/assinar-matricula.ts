import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaInput,
} from "@/lib/validations/matricula";

export async function assinarMatricula(
  token: string,
  input: AssinarMatriculaInput,
) {
  const data = assinarMatriculaSchema.parse(input);

  const [updated] = await getDb()
    .update(matricula)
    .set({
      status: "assinada",
      assinaturaNome: data.nome,
      assinadoEm: new Date(),
    })
    .where(
      and(
        eq(matricula.token, token),
        eq(matricula.status, "aguardando_assinatura"),
      ),
    )
    .returning();

  return updated;
}
