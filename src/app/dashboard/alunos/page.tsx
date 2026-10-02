import { Users } from "lucide-react";

export default function AlunosPage() {
  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-foreground">Alunos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cadastro e gestão dos alunos da academia
      </p>

      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Nenhum aluno cadastrado ainda
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          O cadastro de alunos será implementado em breve.
        </p>
      </div>
    </div>
  );
}
