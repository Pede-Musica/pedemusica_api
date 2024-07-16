/*
  Warnings:

  - You are about to drop the column `voulme_type` on the `materials` table. All the data in the column will be lost.
  - Added the required column `volume_type` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "materials" DROP COLUMN "voulme_type",
ADD COLUMN     "volume_type" TEXT NOT NULL;
