-- CreateTable
CREATE TABLE "log_users" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "class" TEXT,
    "success" BOOLEAN NOT NULL,
    "log" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "log_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_users_id_key" ON "log_users"("id");

-- AddForeignKey
ALTER TABLE "log_users" ADD CONSTRAINT "log_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
