import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MatriculaHistoricoTimeline } from "@/components/matriculas/matricula-historico";
import { MatriculaSignaturePanel } from "@/components/matriculas/matricula-signature-panel";
import { PERIODICIDADES } from "@/constants/periodicidade";
import { getMatriculaById } from "@/services/matriculas/get-matricula-by-id";
import { getMatriculaHistorico } from "@/services/matriculas/get-matricula-historico";

export default async function MatriculaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matricula = await getMatriculaById(id);

  if (!matricula) {
    notFound();
  }

  const historico = await getMatriculaHistorico(id);
  const link = `${process.env.BETTER_AUTH_URL}/assinar/${matricula.token}`;

  return (
    <div className="px-8 py-10">
      <Link
        href="/dashboard/matriculas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Matrícula — {matricula.alunoNome}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plano {matricula.planoNome} ·{" "}
          {
            PERIODICIDADES.find(({ key }) => key === matricula.periodicidade)
              ?.label
          }
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <MatriculaSignaturePanel matricula={matricula} link={link} />

        <div className="rounded-xl border border-border p-4">
          <h2 className="mb-4 text-sm font-medium text-foreground">
            Histórico
          </h2>
          <MatriculaHistoricoTimeline eventos={historico} />
        </div>
      </div>
    </div>
  );
}
