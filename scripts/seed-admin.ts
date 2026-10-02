import { eq } from "drizzle-orm";

import { auth } from "../src/lib/auth/auth";
import { getDb } from "../src/lib/db";
import { user } from "../src/lib/db/schema";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@estacaoacad.com.br";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";
  const name = "Administrador";

  await auth.api.signUpEmail({ body: { email, password, name } });
  await getDb().update(user).set({ role: "admin" }).where(eq(user.email, email));

  console.log(`Admin criado: ${email} / ${password}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
