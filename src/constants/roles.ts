export const ROLES = ["admin", "instrutor", "aluno"] as const;

export type Role = (typeof ROLES)[number];
