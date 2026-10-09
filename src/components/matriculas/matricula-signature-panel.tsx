"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Check, CheckCircle2, Copy, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMatriculaStatusAction } from "@/app/dashboard/matriculas/actions";
import type { getMatriculaById } from "@/services/matriculas/get-matricula-by-id";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function buildWhatsAppLink(
  telefone: string,
  alunoNome: string,
  link: string,
) {
  const digits = telefone.replace(/\D/g, "");
  const numero = digits ? (digits.length <= 11 ? `55${digits}` : digits) : "";
  const mensagem = `Olá, ${alunoNome}! Para concluir sua matrícula na Estação do Corpo, acesse o link abaixo e assine seu contrato digital:\n${link}`;
  const base = numero ? `https://wa.me/${numero}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(mensagem)}`;
}

type MatriculaSummary = NonNullable<
  Awaited<ReturnType<typeof getMatriculaById>>
>;

export function MatriculaSignaturePanel({
  matricula,
  link,
}: {
  matricula: MatriculaSummary;
  link: string;
}) {
  const [copiado, setCopiado] = useState(false);

  const { data } = useQuery({
    queryKey: ["matricula-status", matricula.id],
    queryFn: () => getMatriculaStatusAction(matricula.id),
    initialData: {
      success: true as const,
      status: matricula.status,
      assinaturaNome: matricula.assinaturaNome,
      assinadoEm: matricula.assinadoEm,
    },
    refetchInterval: (query) =>
      query.state.data && !("error" in query.state.data)
        ? query.state.data.status === "assinada"
          ? false
          : 3000
        : 3000,
  });

  const status = data && !("error" in data) ? data.status : matricula.status;
  const assinaturaNome =
    data && !("error" in data) ? data.assinaturaNome : matricula.assinaturaNome;
  const assinadoEm =
    data && !("error" in data) ? data.assinadoEm : matricula.assinadoEm;

  if (status === "assinada") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <p className="text-base font-semibold text-emerald-900">
          Documento assinado!
        </p>
        <p className="text-sm text-emerald-800">
          Assinado por {assinaturaNome}
          {assinadoEm ? ` em ${dateFormatter.format(new Date(assinadoEm))}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-6">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <QRCodeSVG value={link} size={200} marginSize={2} level="M" />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        Aguardando assinatura do aluno...
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <p className="flex-1 truncate text-xs text-muted-foreground">
            {link}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Copiar link"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2000);
            }}
          >
            {copiado ? <Check /> : <Copy />}
          </Button>
        </div>

        <Button
          nativeButton={false}
          variant="outline"
          className="w-full"
          render={
            <a
              href={buildWhatsAppLink(
                matricula.alunoTelefone,
                matricula.alunoNome,
                link,
              )}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <MessageCircle />
          Compartilhar via WhatsApp
        </Button>
      </div>
    </div>
  );
}
