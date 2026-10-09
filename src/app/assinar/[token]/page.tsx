import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { AssinaturaForm } from "@/components/matriculas/assinatura-form";
import { PERIODICIDADES } from "@/constants/periodicidade";
import { getMatriculaByToken } from "@/services/matriculas/get-matricula-by-token";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function AssinarPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const matricula = await getMatriculaByToken(token);

  if (!matricula) {
    notFound();
  }

  const { aluno, plano } = matricula;
  const periodicidadeContratada = PERIODICIDADES.find(
    ({ key }) => key === matricula.periodicidade,
  )!;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold text-foreground">
        Contrato de Matrícula — Estação do Corpo
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Documento simulado para fins de demonstração do sistema.
      </p>

      <section className="mt-6 space-y-1 rounded-xl border border-border p-4 text-sm">
        <p>
          <span className="text-muted-foreground">Aluno:</span>{" "}
          <span className="font-medium text-foreground">{aluno.nome}</span>{" "}
          <span className="text-muted-foreground">— CPF {aluno.cpf}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Plano:</span>{" "}
          <span className="font-medium text-foreground">{plano.nome}</span>
        </p>
        <p>
          <span className="text-muted-foreground">
            {periodicidadeContratada.label}:
          </span>{" "}
          <span className="font-medium text-foreground">
            {currencyFormatter.format(
              Number(plano[periodicidadeContratada.valorField]),
            )}
          </span>
        </p>
      </section>

      <section className="mt-6 space-y-2 rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>
          Pelo presente instrumento, o ALUNO acima identificado matricula-se
          na ESTAÇÃO DO CORPO, no plano indicado, comprometendo-se a respeitar
          as normas internas da academia, os horários de funcionamento e as
          orientações da equipe de instrutores.
        </p>
        <p>
          O ALUNO declara ter respondido ao questionário de saúde abaixo de
          forma verdadeira e estar ciente de que a prática de atividade
          física envolve riscos inerentes, isentando a ESTAÇÃO DO CORPO de
          responsabilidade por condições de saúde não informadas.
        </p>
        <p>
          O cancelamento ou trancamento do plano deve ser solicitado
          diretamente à administração, respeitando as condições vigentes no
          momento da matrícula.
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-xl border border-border p-4">
        <h2 className="text-sm font-medium text-foreground">
          Questionário de saúde
        </h2>
        <ul className="divide-y divide-border">
          {matricula.anamnese.map((item, index) => (
            <li key={index} className="space-y-1 py-2 text-sm first:pt-0">
              <p className="text-foreground">
                {index + 1}. {item.pergunta}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Resposta: {item.resposta ? "Sim" : "Não"}
              </p>
              {item.justificativa && (
                <p className="text-xs text-muted-foreground">
                  Justificativa: {item.justificativa}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        {matricula.status === "assinada" ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <p className="text-base font-semibold text-emerald-900">
              Este documento já foi assinado
            </p>
            <p className="text-sm text-emerald-800">
              Assinado por {matricula.assinaturaNome}
              {matricula.assinadoEm
                ? ` em ${dateFormatter.format(new Date(matricula.assinadoEm))}`
                : ""}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground">
              Assinatura digital
            </h2>
            <AssinaturaForm token={token} nomeSugerido={aluno.nome} />
          </div>
        )}
      </section>
    </div>
  );
}
