import { desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { plano } from "@/lib/db/plano-schema";
import {
  createPlanoSchema,
  type CreatePlanoInput,
} from "@/lib/validations/plano";

function mapPlanoInput(data: CreatePlanoInput) {
  return {
    nome: data.nome,
    periodicidade: data.periodicidade,
    valor: data.valor.toString(),
  };
}

export async function getPlanos() {
  return getDb()
    .select({
      id: plano.id,
      nome: plano.nome,
      periodicidade: plano.periodicidade,
      valor: plano.valor,
      createdAt: plano.createdAt,
      updatedAt: plano.updatedAt,
      alunosVinculados: sql<number>`count(${matricula.id}) filter (where ${matricula.status} != 'cancelada')`.mapWith(
        Number,
      ),
    })
    .from(plano)
    .leftJoin(matricula, eq(matricula.planoId, plano.id))
    .groupBy(plano.id)
    .orderBy(desc(plano.createdAt));
}

export async function createPlano(input: CreatePlanoInput) {
  const data = createPlanoSchema.parse(input);

  const [created] = await getDb()
    .insert(plano)
    .values(mapPlanoInput(data))
    .returning();

  return created;
}

export async function updatePlano(id: string, input: CreatePlanoInput) {
  const data = createPlanoSchema.parse(input);

  const [updated] = await getDb()
    .update(plano)
    .set(mapPlanoInput(data))
    .where(eq(plano.id, id))
    .returning();

  return updated;
}

export async function deletePlano(id: string) {
  await getDb().delete(plano).where(eq(plano.id, id));
}
