import { desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { plano } from "@/lib/db/plano-schema";

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
    .leftJoin(
      matricula,
      eq(matricula.planoId, plano.id),
    )
    .groupBy(plano.id)
    .orderBy(desc(plano.createdAt));
}
