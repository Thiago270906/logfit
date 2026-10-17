import { getDb } from "@/lib/db";
import { academia } from "@/lib/db/academia-schema";

export async function getAcademia() {
  const [row] = await getDb().select().from(academia).limit(1);
  return row ?? null;
}
