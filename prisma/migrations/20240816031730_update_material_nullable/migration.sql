-- AlterTable
ALTER TABLE "enters" ALTER COLUMN "field" DROP NOT NULL;

-- AlterTable
ALTER TABLE "volume_enters" ALTER COLUMN "material_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "volume_exits" ALTER COLUMN "material_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "volumes" ALTER COLUMN "material_id" DROP NOT NULL;
