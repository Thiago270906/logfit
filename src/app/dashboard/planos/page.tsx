import { Wallet } from "lucide-react";

import { PlanoCard } from "@/components/planos/plano-card";
import { PlanoFormDialog } from "@/components/planos/plano-form-dialog";
import { getPlanos } from "@/services/planos/get-planos";

export default async function PlanosPage() {
  const planos = await getPlanos();

  return (
    <div className="px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Planos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastro dos planos oferecidos pela academia
          </p>
        </div>

        <PlanoFormDialog />
      </div>

      {planos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Wallet className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhum plano cadastrado ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &quot;Novo Plano&quot; para cadastrar o primeiro plano.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {planos.map((plano) => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>
      )}
    </div>
  );
}
