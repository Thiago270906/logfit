import { notFound } from "next/navigation";

import { MatriculaSignaturePanel } from "@/components/matriculas/matricula-signature-panel";
import { PERIODICIDADES } from "@/constants/periodicidade";
import { getMatriculaById } from "@/services/matriculas/get-matricula-by-id";

export default async function MatriculaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matricula = await getMatriculaById(id);

  if (!matricula) {
    notFound();
  }

  const link = `${process.env.BETTER_AUTH_URL}/assinar/${matricula.token}`;

  return (
    <div className="px-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Matrícula — {matricula.alunoNome}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plano {matricula.planoNome} ·{" "}
          {
            PERIODICIDADES.find(({ key }) => key === matricula.periodicidade)
              ?.label
          }
        </p>
      </div>

      <div className="mt-8 max-w-md">
        <MatriculaSignaturePanel matricula={matricula} link={link} />
      </div>
    </div>
  );
}
