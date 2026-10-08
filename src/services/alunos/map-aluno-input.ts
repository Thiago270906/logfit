import type { CreateAlunoInput } from "@/lib/validations/aluno";

export function mapAlunoInput(data: CreateAlunoInput) {
  return {
    nome: data.nome,
    email: data.email ?? null,
    idade: data.idade ?? null,
    dataNascimento: data.dataNascimento ?? null,
    genero: data.genero ?? null,
    endereco: data.endereco ?? null,
    bairro: data.bairro ?? null,
    cidade: data.cidade ?? null,
    uf: data.uf ?? null,
    cep: data.cep ?? null,
    telefone: data.telefone,
    cpf: data.cpf,
    rg: data.rg ?? null,
    situacao: data.situacao,
    debito: data.debito.toString(),
    observacoes: data.observacoes ?? null,
  };
}
