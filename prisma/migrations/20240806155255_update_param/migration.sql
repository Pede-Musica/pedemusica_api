/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `system_params` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "system_params_label_key" ON "system_params"("label");
