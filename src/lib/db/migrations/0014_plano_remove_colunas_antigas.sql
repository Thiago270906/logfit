ALTER TABLE "plano" ALTER COLUMN "periodicidade" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "plano" ALTER COLUMN "valor" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "plano" DROP COLUMN "diaria_habilitada";--> statement-breakpoint
ALTER TABLE "plano" DROP COLUMN "diaria_valor";--> statement-breakpoint
ALTER TABLE "plano" DROP COLUMN "mensal_habilitada";--> statement-breakpoint
ALTER TABLE "plano" DROP COLUMN "mensal_valor";--> statement-breakpoint
ALTER TABLE "plano" DROP COLUMN "anual_habilitada";--> statement-breakpoint
ALTER TABLE "plano" DROP COLUMN "anual_valor";