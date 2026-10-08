import { getDb } from "@/lib/db";
import { plano } from "@/lib/db/plano-schema";
import { createPlanoSchema, type CreatePlanoInput } from "@/lib/validations/plano";
import { mapPlanoInput } from "@/services/planos/map-plano-input";

export async function createPlano(input: CreatePlanoInput) {
  const data = createPlanoSchema.parse(input);

  const [created] = await getDb()
    .insert(plano)
    .values(mapPlanoInput(data))
    .returning();

  return created;
}
