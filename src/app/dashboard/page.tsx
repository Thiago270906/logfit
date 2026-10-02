import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-foreground">
        Bem-vindo, {session?.user.name || session?.user.email}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Perfil: {session?.user.role}
      </p>
    </div>
  );
}
