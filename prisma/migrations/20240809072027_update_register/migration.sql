/*
  Warnings:

  - The primary key for the `registers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "enters" DROP CONSTRAINT "enters_register_id_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_register_id_fkey";

-- DropForeignKey
ALTER TABLE "transforms" DROP CONSTRAINT "transforms_register_id_fkey";

-- AlterTable
ALTER TABLE "enters" ALTER COLUMN "register_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "exits" ALTER COLUMN "register_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "registers" DROP CONSTRAINT "registers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "registers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "registers_id_seq";

-- AlterTable
ALTER TABLE "transforms" ALTER COLUMN "register_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transforms" ADD CONSTRAINT "transforms_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
