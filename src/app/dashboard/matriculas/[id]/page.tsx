import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MatriculaCancelarDialog } from "@/components/matriculas/matricula-cancelar-dialog";
import { MatriculaHistoricoTimeline } from "@/components/matriculas/matricula-historico";
import { MatriculaPagamentoPanel } from "@/components/matriculas/matricula-pagamento-panel";
import { MatriculaSignaturePanel } from "@/components/matriculas/matricula-signature-panel";
import { PERIODICIDADES } from "@/constants/periodicidade";
import { getMatriculaById } from "@/services/matriculas/get-matricula-by-id";
import { getMatriculaHistorico } from "@/services/matriculas/get-matricula-historico";
import { getPagamentosByMatricula } from "@/services/pagamentos/get-pagamentos-by-matricula";

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
  const pagamentos = await getPagamentosByMatricula(id);
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

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Matrícula — {matricula.alunoNome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plano {matricula.planoNome} ·{" "}
            {
              PERIODICIDADES.find(
                ({ key }) => key === matricula.periodicidade,
              )?.label
            }
          </p>
        </div>

        {matricula.status !== "cancelada" && (
          <MatriculaCancelarDialog
            matriculaId={matricula.id}
            alunoNome={matricula.alunoNome}
          />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <MatriculaSignaturePanel matricula={matricula} link={link} />
          <MatriculaPagamentoPanel
            pagamentos={pagamentos}
            alunoNome={matricula.alunoNome}
            status={matricula.status}
            periodicidade={matricula.periodicidade}
          />
        </div>

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
