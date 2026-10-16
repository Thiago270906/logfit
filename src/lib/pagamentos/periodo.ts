export type ModoFiltro = "mes" | "periodo";

export function mesAtualStr(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

export function deslocarMes(mesStr: string, delta: number): string {
  const [ano, mes] = mesStr.split("-").map(Number);
  const data = new Date(ano, mes - 1 + delta, 1);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

export function formatarMesAno(mesStr: string): string {
  const [ano, mes] = mesStr.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(ano, mes - 1, 1));
}

export function rangeDoMes(mesStr: string): { inicio: Date; fim: Date } {
  const [ano, mes] = mesStr.split("-").map(Number);
  const inicio = new Date(ano, mes - 1, 1, 0, 0, 0, 0);
  const fim = new Date(ano, mes, 0, 23, 59, 59, 999);
  return { inicio, fim };
}

export type FiltroPagamentos = {
  modo: ModoFiltro;
  mes: string;
  de: string;
  ate: string;
  inicio: Date;
  fim: Date;
};

export function resolverFiltroPagamentos(params: {
  modo?: string;
  mes?: string;
  de?: string;
  ate?: string;
}): FiltroPagamentos {
  const modo: ModoFiltro = params.modo === "periodo" ? "periodo" : "mes";

  if (modo === "periodo" && params.de && params.ate) {
    return {
      modo,
      mes: params.mes ?? mesAtualStr(),
      de: params.de,
      ate: params.ate,
      inicio: new Date(`${params.de}T00:00:00`),
      fim: new Date(`${params.ate}T23:59:59.999`),
    };
  }

  const mes = params.mes ?? mesAtualStr();
  const { inicio, fim } = rangeDoMes(mes);
  return { modo: "mes", mes, de: params.de ?? "", ate: params.ate ?? "", inicio, fim };
}
