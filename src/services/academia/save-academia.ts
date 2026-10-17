import { getDb } from "@/lib/db";
import { ACADEMIA_SINGLETON_ID, academia } from "@/lib/db/academia-schema";
import { academiaSchema, type AcademiaInput } from "@/lib/validations/academia";
import { mapAcademiaInput } from "@/services/academia/map-academia-input";

export async function saveAcademia(input: AcademiaInput) {
  const data = academiaSchema.parse(input);

  const [saved] = await getDb()
    .insert(academia)
    .values({ id: ACADEMIA_SINGLETON_ID, ...mapAcademiaInput(data) })
    .onConflictDoUpdate({
      target: academia.id,
      set: mapAcademiaInput(data),
    })
    .returning();

  return saved;
}
