import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import {
  updateUsuarioSchema,
  type UpdateUsuarioInput,
} from "@/lib/validations/usuario";

export async function updateUsuario(id: string, input: UpdateUsuarioInput) {
  const data = updateUsuarioSchema.parse(input);

  const [updated] = await getDb()
    .update(user)
    .set({ name: data.name, role: data.role })
    .where(eq(user.id, id))
    .returning();

  return updated;
}
