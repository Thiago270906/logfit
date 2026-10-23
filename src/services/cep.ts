export type EnderecoPorCep = {
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export async function getEnderecoByCep(
  cep: string,
): Promise<EnderecoPorCep | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) return null;

  const data = await response.json();
  if (data.erro) return null;

  return {
    endereco: data.logradouro ?? "",
    bairro: data.bairro ?? "",
    cidade: data.localidade ?? "",
    uf: data.uf ?? "",
  };
}
