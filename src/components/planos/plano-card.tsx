import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PlanoDeleteDialog } from "@/components/planos/plano-delete-dialog";
import { PlanoFormDialog } from "@/components/planos/plano-form-dialog";
import {
  labelDuracao,
  PERIODICIDADES,
  sufixoCobranca,
} from "@/constants/periodicidade";
import type { getPlanos } from "@/services/planos";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type Plano = Awaited<ReturnType<typeof getPlanos>>[number];

export function PlanoCard({ plano }: { plano: Plano }) {
  const periodicidadeLabel =
    PERIODICIDADES.find(({ key }) => key === plano.periodicidade)?.label ??
    plano.periodicidade;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="h-1.5 bg-primary" />

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {plano.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Disponível
            </span>
            <PlanoDeleteDialog plano={plano} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {plano.nome}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Plano com cobrança {periodicidadeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="space-y-1 border-t border-border pt-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Valor do plano
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {currencyFormatter.format(Number(plano.valor))}
          </p>
          <p className="text-xs text-muted-foreground">
            {sufixoCobranca(plano.periodicidade)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Duração
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {labelDuracao(plano.periodicidade)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Alunos vinculados
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {plano.alunosVinculados}{" "}
              {plano.alunosVinculados === 1 ? "aluno" : "alunos"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <PlanoFormDialog
            plano={plano}
            trigger={
              <Button variant="outline" className="flex-1">
                Editar
              </Button>
            }
          />
          <Button
            className="flex-1"
            nativeButton={false}
            render={
              <Link href={`/matriculas?planoId=${plano.id}`} />
            }
          >
            Ver matrículas
          </Button>
        </div>
      </div>
    </div>
  );
}
