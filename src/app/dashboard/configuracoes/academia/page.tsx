import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { AcademiaForm } from "@/components/configuracoes/academia-form";
import { getAcademia } from "@/services/academia/get-academia";

export default async function ConfiguracoesAcademiaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!hasRole(session?.user, ["admin"])) {
    redirect("/dashboard");
  }

  const academiaAtual = await getAcademia();

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-foreground">Academia</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configurações gerais da academia.
      </p>

      <div className="mt-8 max-w-xl">
        <AcademiaForm academia={academiaAtual} />
      </div>
    </div>
  );
}
