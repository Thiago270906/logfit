"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";

type HeaderProps = {
  userName: string;
};

export function Header({ userName }: HeaderProps) {
  const pathname = usePathname();
  const isSettings = pathname.startsWith("/dashboard/configuracoes");

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b-[6px] px-6",
        isSettings
          ? "border-[#2b2b2b] bg-[#404040]"
          : "border-[#9c3a1e] bg-primary",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white">
          <Image
            src="/images/logos/logo-estacao-acad-icon.jpg"
            alt="Estação Acad"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
        </div>
        <span className="text-lg font-bold text-primary-foreground">
          {isSettings ? "Configurações" : "Estação do Corpo"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
          <User className="h-4 w-4 text-primary-foreground" />
        </span>
        <span className="text-sm text-primary-foreground">{userName}</span>
      </div>
    </header>
  );
}
