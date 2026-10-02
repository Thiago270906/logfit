import Image from "next/image";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logos/logo-estacao-acad.jpg"
            alt="Estação Acad"
            width={120}
            height={120}
            priority
            className="rounded-full"
          />
        </div>

        <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-center text-xl font-semibold text-foreground">
            Acesse sua conta
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Entre com seu e-mail e senha para continuar
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
