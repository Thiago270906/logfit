import { desc, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { FUNCIONARIO_ROLES } from "@/constants/roles";

export async function getUsuarios() {
  return getDb()
    .select()
    .from(user)
    .where(inArray(user.role, FUNCIONARIO_ROLES))
    .orderBy(desc(user.createdAt));
}
