/*
  Warnings:

  - Added the required column `exit_type` to the `exits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `volume_exits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "exit_type" TEXT NOT NULL,
ADD COLUMN     "person_id" TEXT;

-- AlterTable
ALTER TABLE "volume_exits" ADD COLUMN     "product_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "volume_enters" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "material_id" TEXT NOT NULL,
    "location_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volume_enters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volume_enters_id_key" ON "volume_enters"("id");

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
