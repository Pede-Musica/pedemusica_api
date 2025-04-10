-- CreateTable
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "new_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "new_user_id_key" ON "new_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_token_key" ON "new_user"("token");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_user_id_key" ON "new_user"("user_id");

-- AddForeignKey
ALTER TABLE "new_user" ADD CONSTRAINT "new_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
