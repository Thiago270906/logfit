CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'aluno',
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aluno" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula" serial NOT NULL,
	"nome" text NOT NULL,
	"email" text,
	"data_nascimento" date,
	"genero" text,
	"endereco" text,
	"numero" text,
	"bairro" text,
	"cidade" text,
	"uf" text,
	"cep" text,
	"telefone" text NOT NULL,
	"cpf" text NOT NULL,
	"rg" text,
	"situacao" text DEFAULT 'ativo' NOT NULL,
	"debito" numeric(10, 2) DEFAULT '0' NOT NULL,
	"observacoes" text,
	"foto_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "aluno_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE "plano" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"periodicidade" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matricula" (
	"id" text PRIMARY KEY NOT NULL,
	"aluno_id" text NOT NULL,
	"plano_id" text NOT NULL,
	"tipo" text DEFAULT 'comum' NOT NULL,
	"periodicidade" text NOT NULL,
	"parcelar_mensal" boolean DEFAULT true NOT NULL,
	"renovacao_automatica" boolean DEFAULT true NOT NULL,
	"token" text NOT NULL,
	"status" text DEFAULT 'aguardando_assinatura' NOT NULL,
	"anamnese" jsonb NOT NULL,
	"assinatura_nome" text,
	"assinatura_imagem" text,
	"assinado_em" timestamp,
	"cancelada_em" timestamp,
	"data_inicio" timestamp DEFAULT now() NOT NULL,
	"data_expiracao" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matricula_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "matricula_historico" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"tipo" text NOT NULL,
	"descricao" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagamento" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"forma_pagamento" text,
	"vencimento" timestamp NOT NULL,
	"numero_parcela" integer NOT NULL,
	"pago_em" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_aluno_id_aluno_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."aluno"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_plano_id_plano_id_fk" FOREIGN KEY ("plano_id") REFERENCES "public"."plano"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matricula_historico" ADD CONSTRAINT "matricula_historico_matricula_id_matricula_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matricula"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_matricula_id_matricula_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matricula"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "pagamento_matricula_parcela_idx" ON "pagamento" USING btree ("matricula_id","numero_parcela");