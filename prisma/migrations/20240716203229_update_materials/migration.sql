/*
  Warnings:

  - Added the required column `amount_type` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "amount_type" TEXT NOT NULL,
ADD COLUMN     "in_stock" INTEGER NOT NULL DEFAULT 0;
