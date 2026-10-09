import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaInput,
} from "@/lib/validations/matricula";

function calcularDataExpiracao(periodicidade: string, inicio: Date) {
  const data = new Date(inicio);
  if (periodicidade === "diaria") data.setDate(data.getDate() + 1);
  if (periodicidade === "mensal") data.setMonth(data.getMonth() + 1);
  if (periodicidade === "anual") data.setFullYear(data.getFullYear() + 1);
  return data;
}

export async function assinarMatricula(
  token: string,
  input: AssinarMatriculaInput,
) {
  const data = assinarMatriculaSchema.parse(input);

  const [pendente] = await getDb()
    .select({ id: matricula.id, periodicidade: matricula.periodicidade })
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
  const dataExpiracao = calcularDataExpiracao(
    pendente.periodicidade,
    assinadoEm,
  );

  const [updated] = await getDb()
    .update(matricula)
    .set({
      status: "assinada",
      assinaturaNome: data.nome,
      assinadoEm,
      dataExpiracao,
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
