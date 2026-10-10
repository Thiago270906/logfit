ALTER TABLE "matricula" ADD COLUMN "tipo" text DEFAULT 'comum' NOT NULL;--> statement-breakpoint
ALTER TABLE "matricula" ADD COLUMN "cancelada_em" timestamp;