import { desc, eq, inArray } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { FUNCIONARIO_ROLES } from "@/constants/roles";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  type CreateUsuarioInput,
  type UpdateUsuarioInput,
} from "@/lib/validations/usuario";

export async function getUsuarios() {
  return getDb()
    .select()
    .from(user)
    .where(inArray(user.role, FUNCIONARIO_ROLES))
    .orderBy(desc(user.createdAt));
}

export async function createUsuario(input: CreateUsuarioInput) {
  const data = createUsuarioSchema.parse(input);

  const { user: created } = await auth.api.signUpEmail({
    body: { name: data.name, email: data.email, password: data.password },
  });

  const [updated] = await getDb()
    .update(user)
    .set({ role: data.role })
    .where(eq(user.id, created.id))
    .returning();

  return updated;
}

export async function updateUsuario(id: string, input: UpdateUsuarioInput) {
  const data = updateUsuarioSchema.parse(input);

  const [updated] = await getDb()
    .update(user)
    .set({ name: data.name, role: data.role })
    .where(eq(user.id, id))
    .returning();

  return updated;
}

export async function deleteUsuario(id: string) {
  await getDb().delete(user).where(eq(user.id, id));
}
