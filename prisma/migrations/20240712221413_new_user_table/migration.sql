-- CreateTable
CREATE TABLE "log_systems" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "new_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_systems_id_key" ON "log_systems"("id");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_id_key" ON "new_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_token_key" ON "new_user"("token");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_user_id_key" ON "new_user"("user_id");

-- AddForeignKey
ALTER TABLE "log_systems" ADD CONSTRAINT "log_systems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_user" ADD CONSTRAINT "new_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
