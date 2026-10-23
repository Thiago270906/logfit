"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { toggleRenovacaoAutomaticaAction } from "@/app/(dashboard)/matriculas/actions";

export function MatriculaRenovacaoAutomaticaToggle({
  matriculaId,
  renovacaoAutomatica,
}: {
  matriculaId: string;
  renovacaoAutomatica: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(renovacaoAutomatica);
  const [isSalvando, setIsSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(nextChecked: boolean) {
    setChecked(nextChecked);
    setIsSalvando(true);
    setError(null);

    const result = await toggleRenovacaoAutomaticaAction(
      matriculaId,
      nextChecked,
    );

    if (result?.error) {
      setChecked(!nextChecked);
      setError(result.error);
      setIsSalvando(false);
      return;
    }

    setIsSalvando(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <label className="flex items-center gap-2 text-sm text-foreground">
        Rematrícula automática
        <Switch
          checked={checked}
          onCheckedChange={handleChange}
          disabled={isSalvando}
        />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
