"use client";

import { useRouter } from "next/navigation";

export function AlunoTableRow({
  alunoId,
  children,
}: {
  alunoId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() => router.push(`/alunos/${alunoId}`)}
    >
      {children}
    </tr>
  );
}
