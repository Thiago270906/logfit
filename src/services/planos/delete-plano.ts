import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { plano } from "@/lib/db/plano-schema";

export async function deletePlano(id: string) {
  await getDb().delete(plano).where(eq(plano.id, id));
}
