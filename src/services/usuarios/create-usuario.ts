import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import {
  createUsuarioSchema,
  type CreateUsuarioInput,
} from "@/lib/validations/usuario";

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
