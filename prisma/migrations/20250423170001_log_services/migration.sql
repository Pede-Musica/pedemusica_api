-- CreateTable
CREATE TABLE "log_services" (
    "id" SERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "class" TEXT,
    "success" BOOLEAN NOT NULL,
    "log" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "log_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_services_id_key" ON "log_services"("id");
