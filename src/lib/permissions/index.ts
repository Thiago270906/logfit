import type { Role } from "@/constants/roles";

type SessionUser = { role?: string | null } | null | undefined;

export function hasRole(user: SessionUser, allowed: Role[]) {
  if (!user?.role) return false;
  return allowed.includes(user.role as Role);
}
