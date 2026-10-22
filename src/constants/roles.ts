export const ROLES = ["admin", "instrutor", "aluno"] as const;

export type Role = (typeof ROLES)[number];

// Papéis com acesso ao sistema gerenciados em Configurações > Usuários.
// "aluno" fica fora: contas de aluno são tratadas pelo módulo Alunos/Painel do aluno.
export const FUNCIONARIO_ROLES = ["admin", "instrutor"] as const;

export type FuncionarioRole = (typeof FUNCIONARIO_ROLES)[number];

export const FUNCIONARIO_ROLE_LABELS: Record<FuncionarioRole, string> = {
  admin: "Administrador",
  instrutor: "Instrutor",
};
