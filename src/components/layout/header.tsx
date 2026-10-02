import Image from "next/image";
import { User } from "lucide-react";

type HeaderProps = {
  userName: string;
};

export function Header({ userName }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b-4 border-[#5d2111] bg-primary px-6">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logos/logo-estacao-acad-icon.jpg"
          alt="Estação Acad"
          width={44}
          height={44}
          className="rounded-full"
        />
        <span className="text-lg font-bold text-primary-foreground">
          Estação do Corpo
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
