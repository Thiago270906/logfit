import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserCog } from "lucide-react";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { FUNCIONARIO_ROLE_LABELS } from "@/constants/roles";
import { UsuarioFormDialog } from "@/components/usuarios/usuario-form-dialog";
import { UsuarioRowActions } from "@/components/usuarios/usuario-row-actions";
import { getUsuarios } from "@/services/usuarios";

export default async function ConfiguracoesUsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!hasRole(session?.user, ["admin"])) {
    redirect("/");
  }

  const usuarios = await getUsuarios();

  return (
    <div className="px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Usuários
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Funcionários com acesso ao sistema (administradores e
            instrutores).
          </p>
        </div>

        <UsuarioFormDialog />
      </div>

      {usuarios.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <UserCog className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhum usuário cadastrado ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &quot;Novo Usuário&quot; para dar acesso a um
            funcionário.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Papel</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {usuario.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {usuario.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {usuario.role
                      ? FUNCIONARIO_ROLE_LABELS[
                          usuario.role as keyof typeof FUNCIONARIO_ROLE_LABELS
                        ] ?? usuario.role
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <UsuarioRowActions
                      usuario={usuario}
                      isCurrentUser={usuario.id === session?.user.id}
                    />
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
