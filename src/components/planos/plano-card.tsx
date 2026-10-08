import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanoDeleteDialog } from "@/components/planos/plano-delete-dialog";
import { PlanoFormDialog } from "@/components/planos/plano-form-dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Plano } from "@/lib/db/plano-schema";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function PlanoCard({
  plano,
  valor,
}: {
  plano: Plano;
  valor: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span>{plano.nome}</span>
          <div className="flex items-center gap-1">
            <PlanoFormDialog
              plano={plano}
              trigger={
                <Button variant="ghost" size="icon-xs" aria-label="Editar plano">
                  <Pencil />
                </Button>
              }
            />
            <PlanoDeleteDialog plano={plano} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-foreground">
          {currencyFormatter.format(Number(valor))}
        </p>
      </CardContent>
    </Card>
  );
}
