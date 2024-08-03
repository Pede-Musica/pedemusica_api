/*
  Warnings:

  - You are about to drop the column `volume_type` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `exit_id` on the `volumes` table. All the data in the column will be lost.
  - You are about to drop the column `volume_type` on the `volumes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "volumes" DROP CONSTRAINT "volumes_exit_id_fkey";

-- AlterTable
ALTER TABLE "materials" DROP COLUMN "volume_type",
ALTER COLUMN "volume" SET DEFAULT 0,
ALTER COLUMN "volume" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "volumes" DROP COLUMN "exit_id",
DROP COLUMN "volume_type",
ADD COLUMN     "exited" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "volume" SET DEFAULT 0,
ALTER COLUMN "volume" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "volume_logs" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "history" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volume_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volume_exits" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "exit_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transformed" BOOLEAN NOT NULL DEFAULT false,
    "exited" BOOLEAN NOT NULL DEFAULT false,
    "material_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volume_exits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volume_logs_id_key" ON "volume_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volume_exits_id_key" ON "volume_exits"("id");

-- AddForeignKey
ALTER TABLE "volume_logs" ADD CONSTRAINT "volume_logs_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_exit_id_fkey" FOREIGN KEY ("exit_id") REFERENCES "exits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
