/*
  Warnings:

  - You are about to drop the column `enter_at` on the `enters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enters" DROP COLUMN "enter_at",
ADD COLUMN     "entry_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "volumes" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "volume" INTEGER NOT NULL DEFAULT 0,
    "volume_type" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volumes_id_key" ON "volumes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volumes_entry_id_key" ON "volumes"("entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "volumes_product_id_key" ON "volumes"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "volumes_material_id_key" ON "volumes"("material_id");

-- CreateIndex
CREATE UNIQUE INDEX "volumes_location_id_key" ON "volumes"("location_id");

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
