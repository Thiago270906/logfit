ALTER TABLE "plano" ADD COLUMN "periodicidade" text DEFAULT 'mensal' NOT NULL;--> statement-breakpoint
ALTER TABLE "plano" ADD COLUMN "valor" numeric(10, 2) DEFAULT '0' NOT NULL;