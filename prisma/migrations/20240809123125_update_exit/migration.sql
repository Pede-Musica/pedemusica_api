/*
  Warnings:

  - Added the required column `status` to the `exits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "status" TEXT NOT NULL;
