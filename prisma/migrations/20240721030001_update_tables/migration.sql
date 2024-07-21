/*
  Warnings:

  - Made the column `register_id` on table `enters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `enters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `producer_id` on table `enters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `register_id` on table `exits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `exits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `register_id` on table `transforms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `transforms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "enters" ALTER COLUMN "register_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "producer_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "exits" ALTER COLUMN "register_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "transforms" ALTER COLUMN "register_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;
