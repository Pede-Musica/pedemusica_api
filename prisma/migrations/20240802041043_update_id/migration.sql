/*
  Warnings:

  - The primary key for the `enters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `batch` on the `enters` table. All the data in the column will be lost.
  - The `id` column on the `enters` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `exits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `exits` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `transforms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `transforms` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "enters" DROP CONSTRAINT "enters_pkey",
DROP COLUMN "batch",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "enters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exits" DROP CONSTRAINT "exits_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "exits_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transforms" DROP CONSTRAINT "transforms_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "transforms_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_id_key" ON "enters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "exits_id_key" ON "exits"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transforms_id_key" ON "transforms"("id");
