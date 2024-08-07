/*
  Warnings:

  - Added the required column `product_name` to the `volume_enters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `volume_exits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `volumes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "volume_enters" ADD COLUMN     "product_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "volume_exits" ADD COLUMN     "product_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "volumes" ADD COLUMN     "product_name" TEXT NOT NULL;
