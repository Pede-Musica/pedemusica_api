-- CreateTable
CREATE TABLE "system_params" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "system_params_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_params_id_key" ON "system_params"("id");
