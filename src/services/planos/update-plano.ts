import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { plano } from "@/lib/db/plano-schema";
import { createPlanoSchema, type CreatePlanoInput } from "@/lib/validations/plano";
import { mapPlanoInput } from "@/services/planos/map-plano-input";

export async function updatePlano(id: string, input: CreatePlanoInput) {
  const data = createPlanoSchema.parse(input);

  const [updated] = await getDb()
    .update(plano)
    .set(mapPlanoInput(data))
    .where(eq(plano.id, id))
    .returning();

  return updated;
}
