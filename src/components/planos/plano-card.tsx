import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlanoDeleteDialog } from "@/components/planos/plano-delete-dialog";
import { PlanoFormDialog } from "@/components/planos/plano-form-dialog";
import { PERIODICIDADES } from "@/constants/periodicidade";
import type { Plano } from "@/lib/db/plano-schema";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function PlanoCard({ plano }: { plano: Plano }) {
  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/60 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted px-4 py-3">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          {plano.nome}
        </h3>
        <div className="flex items-center gap-1">
          <PlanoFormDialog
            plano={plano}
            trigger={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Editar plano"
              >
                <Pencil />
              </Button>
            }
          />
          <PlanoDeleteDialog plano={plano} />
        </div>
      </div>

      <ul className="divide-y divide-border px-4">
        {PERIODICIDADES.map(({ key, label, habilitadaField, valorField }) => {
          const habilitada = plano[habilitadaField];
          const valor = plano[valorField];

          return (
            <li
              key={key}
              className="flex items-center justify-between gap-2 py-3"
            >
              <span
                className={
                  habilitada
                    ? "text-sm font-medium text-foreground"
                    : "text-sm text-muted-foreground"
                }
              >
                {label}
              </span>
              <span
                className={
                  habilitada
                    ? "text-sm font-semibold text-primary"
                    : "text-xs text-muted-foreground"
                }
              >
                {habilitada && valor
                  ? currencyFormatter.format(Number(valor))
                  : "Não disponível"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
