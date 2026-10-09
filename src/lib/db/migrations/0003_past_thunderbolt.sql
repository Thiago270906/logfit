CREATE TABLE "matricula_historico" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"tipo" text NOT NULL,
	"descricao" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "matricula" ADD COLUMN "data_expiracao" timestamp;--> statement-breakpoint
ALTER TABLE "matricula_historico" ADD CONSTRAINT "matricula_historico_matricula_id_matricula_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matricula"("id") ON DELETE cascade ON UPDATE no action;