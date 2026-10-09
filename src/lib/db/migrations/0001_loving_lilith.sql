CREATE TABLE "matricula" (
	"id" text PRIMARY KEY NOT NULL,
	"aluno_id" text NOT NULL,
	"plano_id" text NOT NULL,
	"token" text NOT NULL,
	"status" text DEFAULT 'aguardando_assinatura' NOT NULL,
	"anamnese" jsonb NOT NULL,
	"assinatura_nome" text,
	"assinado_em" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matricula_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_aluno_id_aluno_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."aluno"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_plano_id_plano_id_fk" FOREIGN KEY ("plano_id") REFERENCES "public"."plano"("id") ON DELETE no action ON UPDATE no action;