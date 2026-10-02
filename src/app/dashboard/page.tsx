import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Bem-vindo, {session.user.name || session.user.email}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Perfil: {session.user.role}
      </p>
    </main>
  );
}
