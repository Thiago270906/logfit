ALTER TABLE "pagamento" ADD COLUMN "vencimento" timestamp;--> statement-breakpoint
ALTER TABLE "pagamento" ADD COLUMN "numero_parcela" integer;--> statement-breakpoint
UPDATE "pagamento" SET "vencimento" = "created_at" WHERE "vencimento" IS NULL;--> statement-breakpoint
UPDATE "pagamento" p SET "numero_parcela" = sub.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "matricula_id" ORDER BY "created_at" ASC) AS rn
  FROM "pagamento"
) sub
WHERE p."id" = sub."id" AND p."numero_parcela" IS NULL;--> statement-breakpoint
ALTER TABLE "pagamento" ALTER COLUMN "vencimento" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pagamento" ALTER COLUMN "numero_parcela" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "pagamento_matricula_parcela_idx" ON "pagamento" USING btree ("matricula_id","numero_parcela");
