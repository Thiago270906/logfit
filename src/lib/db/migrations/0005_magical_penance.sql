CREATE TABLE "pagamento" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"forma_pagamento" text,
	"pago_em" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_matricula_id_matricula_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matricula"("id") ON DELETE cascade ON UPDATE no action;