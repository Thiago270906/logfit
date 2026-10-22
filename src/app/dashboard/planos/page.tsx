import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlanoCard } from "@/components/planos/plano-card";
import { PlanoFormDialog } from "@/components/planos/plano-form-dialog";
import { getPlanos } from "@/services/planos/get-planos";

export default async function PlanosPage() {
  const planos = await getPlanos();

  return (
    <div className="px-8 py-10">
      <p className="text-sm text-muted-foreground">
        Estação do Corpo / <span className="text-foreground">Planos</span>
      </p>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Planos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulte os planos disponíveis e gerencie valores e condições.
          </p>
        </div>

        <PlanoFormDialog
          trigger={<Button>+ Novo plano</Button>}
        />
      </div>

      {planos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Wallet className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhum plano cadastrado ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &quot;+ Novo plano&quot; para cadastrar o primeiro
            plano.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planos.map((plano) => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>
      )}
    </div>
  );
}
