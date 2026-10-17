CREATE TABLE "academia" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"nome" text,
	"telefone" text,
	"cnpj" text,
	"endereco" text,
	"lotacao_maxima" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
