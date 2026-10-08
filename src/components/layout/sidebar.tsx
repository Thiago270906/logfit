"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  LayoutDashboard,
  LogOut,
  Radio,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/alunos", label: "Alunos", icon: Users },
  { href: "/dashboard/planos", label: "Planos", icon: Wallet },
];

const settingsNavItems = [
  {
    href: "/dashboard/configuracoes/academia",
    label: "Academia",
    icon: Building2,
  },
  {
    href: "/dashboard/configuracoes/sensores",
    label: "Sensores",
    icon: Radio,
  },
];

function navLinkClass(isActive: boolean) {
  return cn(
    "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white",
    isActive && "border-primary bg-white/5 text-white",
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isSettings = pathname.startsWith("/dashboard/configuracoes");
  const activeHref = [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.href;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col justify-between bg-[#404040] py-4">
      <nav className="flex flex-col gap-1 px-3">
        {isSettings ? (
          <>
            <Link href="/dashboard" className={navLinkClass(false)}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>

            <div className="my-2 border-t border-white/10" />

            {settingsNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(isActive)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </>
        ) : (
          navItems.map((item) => {
            const isActive = activeHref === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(isActive)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })
        )}
      </nav>

      <div className="px-3">
        {!isSettings && (
          <>
            <Link
              href="/dashboard/configuracoes"
              className={navLinkClass(false)}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>

            <div className="my-2 border-t border-white/10" />
          </>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
