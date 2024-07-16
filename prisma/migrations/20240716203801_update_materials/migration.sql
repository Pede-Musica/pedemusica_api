/*
  Warnings:

  - You are about to drop the column `amount` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `amount_type` on the `materials` table. All the data in the column will be lost.
  - Added the required column `voulme_type` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "materials" DROP COLUMN "amount",
DROP COLUMN "amount_type",
ADD COLUMN     "volume" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "voulme_type" TEXT NOT NULL;
