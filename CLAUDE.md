# LogFit — Estação Corpo

Sistema de gestão para academia (alunos, treinos, planos, check-in, aulas e financeiro).

## Visão do produto

### Perfis de usuário (roles)

- **Admin** — gestão total: alunos, planos, financeiro, instrutores, relatórios.
- **Instrutor/Personal** — gerencia fichas de treino, avaliações físicas e aulas dos seus alunos.
- **Aluno** — acompanha treino, evolução física, aulas marcadas e status do plano.

### Módulos principais

1. **Alunos** — cadastro, dados pessoais, anamnese/histórico de saúde, foto, status (ativo/inativo/trancado).
2. **Planos e matrículas** — mensal/trimestral/anual, vigência, renovação, trancamento, cancelamento.
3. **Financeiro** — mensalidades, status (pago/pendente/atrasado), histórico de pagamentos, inadimplência.
4. **Check-in** — registro de acesso do aluno (código/QR), histórico de frequência.
5. **Treinos** — fichas de treino (exercícios, séries, repetições, carga), montadas pelo instrutor, vinculadas ao aluno.
6. **Avaliação física** — medidas corporais, peso, % gordura, evolução ao longo do tempo (gráficos com Recharts).
7. **Aulas coletivas** — agenda (yoga, spinning, cross etc.), vagas, inscrição do aluno, lista de presença.
8. **Dashboard administrativo** — receita, inadimplência, frequência média, taxa de evasão (churn), aulas mais procuradas.
9. **Painel do aluno** — próximo treino, evolução, aulas marcadas, status do plano/pagamento.
10. **Notificações internas** — vencimento de plano, aula marcada, nova ficha de treino (in-app; e-mail fica para uma fase futura, via integração real do Marketplace quando houver necessidade concreta).

Pagamento online (gateway de cobrança) e envio de e-mail/SMS **não entram na v1** — são evoluções futuras, a serem resolvidas com uma integração real do Vercel Marketplace quando surgir a necessidade, nunca com mock como padrão.

---

## Stack (obrigatória — não alterar sem justificativa técnica explícita e aprovação)

- **TypeScript**
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **shadcn/ui**
- **PostgreSQL**
- **Drizzle ORM**
- **Zod**
- **React Hook Form**
- **TanStack Query**
- **Better Auth**
- **Recharts**

Qualquer mudança de stack/arquitetura exige explicar motivo técnico e impacto **antes** de adotar.

## Estrutura de pastas (`src/`)

```text
src/
├── app/            # rotas nativas do App Router (sem pasta "routes" separada)
├── components/
│   ├── ui/         # shadcn/ui
│   ├── layout/
│   └── <contexto>/ # componentes específicos (ex: alunos/, treinos/, aulas/)
├── hooks/          # hooks React (use-auth.ts, use-mobile.ts, etc.)
├── services/
│   └── <entidade>/ # regras de negócio (create-*, update-*, delete-*, get-*)
├── lib/
│   ├── db/         # Drizzle client + schema + migrations
│   ├── auth/       # Better Auth config
│   ├── validations/ # schemas Zod
│   └── permissions/ # RBAC (admin/instrutor/aluno)
├── types/          # tipos que não podem ser inferidos (evitar duplicar o que o Drizzle já infere)
└── constants/       # enums e valores fixos
```

Fluxo de responsabilidade: **Interface → Componentes → Hooks → Services → ORM/Banco**. Nenhuma query SQL ou acesso ao banco dentro de componente/página.

## Princípios

- Fortemente tipado; evitar `any` sem justificativa clara.
- Server Components por padrão; `"use client"` só quando há interatividade.
- Server Actions / Route Handlers para mutações, com validação Zod reaplicada no servidor (nunca confiar só no client).
- Formulários complexos: React Hook Form + Zod (schema reaproveitado entre front e back quando fizer sentido).
- Migrations para toda alteração de banco (nunca schema solto sem migration).
- Componentes pequenos, com estados de loading/erro/vazio e feedback visual.
- Monólito modular na v1. Nada de Redis, filas, microsserviços, múltiplos bancos sem necessidade concreta.
- Segredos sempre em `.env`, nunca hardcoded; manter `.env.example` atualizado.
- Menor privilégio: permissões por role (admin/instrutor/aluno) checadas em `lib/permissions`, nunca só na UI.

## Padrão de trabalho

1. Entender a estrutura existente antes de criar algo novo.
2. Reutilizar componentes/services já existentes; evitar abstração duplicada.
3. Menor alteração necessária para resolver o pedido.
4. Preferir a solução mais simples que não feche portas para o crescimento do sistema.
5. Não introduzir biblioteca nova se a stack atual já resolve.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
