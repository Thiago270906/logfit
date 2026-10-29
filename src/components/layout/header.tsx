import Image from "next/image";
import { User } from "lucide-react";

type HeaderProps = {
  userName: string;
};

export function Header({ userName }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b-[6px] border-[#9c3a1e] bg-primary px-6">
      <div className="flex items-center gap-4">
        <Image
          src="/images/logos/logo-logfit.png"
          alt="LogFit"
          width={120}
          height={40}
          className="h-9 w-auto object-contain"
        />

        <div className="h-8 w-px bg-primary-foreground/30" />

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
            Estação do Corpo
          </span>
        </div>
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
