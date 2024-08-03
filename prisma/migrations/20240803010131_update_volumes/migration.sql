-- AlterTable
ALTER TABLE "volumes" ADD COLUMN     "exit_id" INTEGER,
ADD COLUMN     "transformed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_exit_id_fkey" FOREIGN KEY ("exit_id") REFERENCES "exits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
