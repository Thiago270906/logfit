import { Users } from "lucide-react";

import { AlunoFormDialog } from "@/components/alunos/aluno-form-dialog";
import { AlunoRowActions } from "@/components/alunos/aluno-row-actions";
import { getAlunos } from "@/services/alunos/get-alunos";

export default async function AlunosPage() {
  const alunos = await getAlunos();

  return (
    <div className="px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Alunos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastro e gestão dos alunos da academia
          </p>
        </div>

        <AlunoFormDialog />
      </div>

      {alunos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Users className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhum aluno cadastrado ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &quot;Novo Aluno&quot; para cadastrar o primeiro aluno.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">CPF</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">CEP</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td className="px-4 py-3 text-muted-foreground">
                    {String(aluno.matricula).padStart(4, "0")}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {aluno.nome}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {aluno.cpf}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {aluno.telefone}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {aluno.cep ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <AlunoRowActions aluno={aluno} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
