import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MatriculaForm } from "@/components/matriculas/matricula-form";
import { getAlunos } from "@/services/alunos/get-alunos";
import { getPlanos } from "@/services/planos/get-planos";

export default async function NovaMatriculaPage() {
  const [alunos, planos] = await Promise.all([getAlunos(), getPlanos()]);

  return (
    <div className="px-8 py-10">
      <Link
        href="/dashboard/matriculas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground">
          Nova Matrícula
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione o aluno e o plano, preencha o questionário de saúde e
          envie para assinatura.
        </p>

        <div className="mt-8">
          <MatriculaForm alunos={alunos} planos={planos} />
        </div>
      </div>
    </div>
  );
}
