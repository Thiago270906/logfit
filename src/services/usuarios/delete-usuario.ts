import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function deleteUsuario(id: string) {
  await getDb().delete(user).where(eq(user.id, id));
}
