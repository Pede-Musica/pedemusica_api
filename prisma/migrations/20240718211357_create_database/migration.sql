-- CreateTable
CREATE TABLE "contents" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registers" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enters" (
    "id" TEXT NOT NULL,
    "register_id" INTEGER,
    "user_id" TEXT,
    "producer_id" TEXT,
    "field" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "enter_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "enters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exits" (
    "id" TEXT NOT NULL,
    "register_id" INTEGER,
    "user_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "exits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transforms" (
    "id" TEXT NOT NULL,
    "register_id" INTEGER,
    "user_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "transforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contents_id_key" ON "contents"("id");

-- CreateIndex
CREATE UNIQUE INDEX "registers_id_key" ON "registers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_id_key" ON "enters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_register_id_key" ON "enters"("register_id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_user_id_key" ON "enters"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_producer_id_key" ON "enters"("producer_id");

-- CreateIndex
CREATE UNIQUE INDEX "exits_id_key" ON "exits"("id");

-- CreateIndex
CREATE UNIQUE INDEX "exits_register_id_key" ON "exits"("register_id");

-- CreateIndex
CREATE UNIQUE INDEX "exits_user_id_key" ON "exits"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transforms_id_key" ON "transforms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transforms_register_id_key" ON "transforms"("register_id");

-- CreateIndex
CREATE UNIQUE INDEX "transforms_user_id_key" ON "transforms"("user_id");

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transforms" ADD CONSTRAINT "transforms_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transforms" ADD CONSTRAINT "transforms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
