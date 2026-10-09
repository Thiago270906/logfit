import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PERIODICIDADES } from "@/constants/periodicidade";
import { getMatriculas } from "@/services/matriculas/get-matriculas";
import {
  getSituacaoMatricula,
  type MatriculaSituacao,
} from "@/services/matriculas/get-situacao-matricula";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const SITUACAO_LABEL: Record<MatriculaSituacao, string> = {
  aguardando_assinatura: "Aguardando assinatura",
  ativa: "Ativa",
  expirada: "Expirada",
};

const SITUACAO_CLASS: Record<MatriculaSituacao, string> = {
  aguardando_assinatura: "bg-amber-100 text-amber-800",
  ativa: "bg-emerald-100 text-emerald-800",
  expirada: "bg-red-100 text-red-800",
};

export default async function MatriculasPage() {
  const matriculas = await getMatriculas();

  return (
    <div className="px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Matrículas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Matrículas de alunos nos planos da academia
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/dashboard/matriculas/nova" />}
        >
          Nova Matrícula
        </Button>
      </div>

      {matriculas.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhuma matrícula cadastrada ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &quot;Nova Matrícula&quot; para cadastrar a primeira.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
          {matriculas.map((item) => {
            const situacao = getSituacaoMatricula(
              item.status,
              item.dataExpiracao,
            );

            return (
              <li key={item.id}>
                <Link
                  href={`/dashboard/matriculas/${item.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.alunoNome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.planoNome} ·{" "}
                      {
                        PERIODICIDADES.find(
                          ({ key }) => key === item.periodicidade,
                        )?.label
                      }{" "}
                      · criada em {dateFormatter.format(item.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${SITUACAO_CLASS[situacao]}`}
                  >
                    {SITUACAO_LABEL[situacao]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
