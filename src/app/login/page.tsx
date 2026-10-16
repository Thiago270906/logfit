import Image from "next/image";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-neutral-100">
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-primary md:flex">
        <div
          className="absolute inset-0 bg-white"
          style={{
            clipPath: "polygon(0% 0%, 9% 0%, 99% 100%, 0% 100%)",
          }}
        />
        <div
          className="absolute inset-0 bg-[#505050]"
          style={{
            clipPath: "polygon(0% 0%, 3% 0%, 93% 100%, 0% 100%)",
          }}
        />

        <div className="relative flex size-80 flex-col items-center justify-center rounded-full bg-white pt-8">
          <Image
            src="/images/logos/logo-estacao-acad.jpg"
            alt="Estação do Corpo"
            width={220}
            height={220}
            priority
            className="size-44 object-contain"
          />
          <p className="mt-1 text-center text-xl font-bold text-[#505050]">
            Estação do Corpo
          </p>
          <p className="mt-0.5 text-center text-[11px] tracking-[0.5em] text-[#505050]/70">
            academia
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 md:w-1/2">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg ring-1 ring-black/5">
          <div className="mb-6 flex justify-center md:hidden">
            <Image
              src="/images/logos/logo-estacao-acad-icon.jpg"
              alt="Estação do Corpo"
              width={72}
              height={72}
              priority
              className="rounded-full"
            />
          </div>

          <h1 className="mb-6 text-2xl font-bold text-foreground">
            Acesse sua conta
          </h1>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
