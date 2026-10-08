import { desc } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { plano } from "@/lib/db/plano-schema";

export async function getPlanos() {
  return getDb().select().from(plano).orderBy(desc(plano.createdAt));
}
