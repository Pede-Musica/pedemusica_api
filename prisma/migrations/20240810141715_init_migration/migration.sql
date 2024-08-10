-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "user" TEXT,
    "password" TEXT,
    "person_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "position" VARCHAR(255),
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "address" VARCHAR(255),
    "type" INTEGER NOT NULL DEFAULT 1,
    "cpf_cnpj" VARCHAR(255),
    "sysAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isUser" BOOLEAN NOT NULL DEFAULT false,
    "isCustomer" BOOLEAN NOT NULL DEFAULT false,
    "isProducer" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producers" (
    "id" TEXT NOT NULL,
    "cad_pro" VARCHAR(255),
    "ggn" VARCHAR(255),
    "person_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "producers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "person_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "product_id" TEXT,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sizes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "product_id" TEXT,

    CONSTRAINT "product_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" VARCHAR(255),
    "sector_id" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "in_stock" INTEGER NOT NULL DEFAULT 0,
    "traceable" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registers" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enters" (
    "id" SERIAL NOT NULL,
    "register_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "producer_id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "entry_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observation" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "enters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exits" (
    "id" SERIAL NOT NULL,
    "exit_type" TEXT NOT NULL,
    "person_id" TEXT,
    "register_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exit_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observation" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "exits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transforms" (
    "id" SERIAL NOT NULL,
    "register_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trasnform_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observation" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "transforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volumes" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transformed" BOOLEAN NOT NULL DEFAULT false,
    "exited" BOOLEAN NOT NULL DEFAULT false,
    "material_id" TEXT NOT NULL,
    "location_id" TEXT,
    "exit_id" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volume_logs" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "origin_history" TEXT,
    "dropped_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "generated_history" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volume_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volume_enters" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "volume_exits" (
    "id" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "exit_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transformed" BOOLEAN NOT NULL DEFAULT false,
    "exited" BOOLEAN NOT NULL DEFAULT false,
    "material_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "volume_exits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_params" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "system_params_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_key" ON "users"("user");

-- CreateIndex
CREATE UNIQUE INDEX "users_person_id_key" ON "users"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "persons_id_key" ON "persons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "producers_id_key" ON "producers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "producers_person_id_key" ON "producers"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_key" ON "customers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_person_id_key" ON "customers"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "log_systems_id_key" ON "log_systems"("id");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_id_key" ON "new_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_token_key" ON "new_user"("token");

-- CreateIndex
CREATE UNIQUE INDEX "new_user_user_id_key" ON "new_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_id_key" ON "products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_id_key" ON "product_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_sizes_id_key" ON "product_sizes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_key" ON "locations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sectors_id_key" ON "sectors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sectors_name_key" ON "sectors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "materials_id_key" ON "materials"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contents_id_key" ON "contents"("id");

-- CreateIndex
CREATE UNIQUE INDEX "registers_id_key" ON "registers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_id_key" ON "enters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "enters_register_id_key" ON "enters"("register_id");

-- CreateIndex
CREATE UNIQUE INDEX "exits_id_key" ON "exits"("id");

-- CreateIndex
CREATE UNIQUE INDEX "exits_register_id_key" ON "exits"("register_id");

-- CreateIndex
CREATE UNIQUE INDEX "transforms_id_key" ON "transforms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transforms_register_id_key" ON "transforms"("register_id");

-- CreateIndex
CREATE UNIQUE INDEX "volumes_id_key" ON "volumes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volume_logs_id_key" ON "volume_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volume_enters_id_key" ON "volume_enters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volume_exits_id_key" ON "volume_exits"("id");

-- CreateIndex
CREATE UNIQUE INDEX "system_params_id_key" ON "system_params"("id");

-- CreateIndex
CREATE UNIQUE INDEX "system_params_label_key" ON "system_params"("label");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producers" ADD CONSTRAINT "producers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_systems" ADD CONSTRAINT "log_systems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_user" ADD CONSTRAINT "new_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enters" ADD CONSTRAINT "enters_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transforms" ADD CONSTRAINT "transforms_register_id_fkey" FOREIGN KEY ("register_id") REFERENCES "registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transforms" ADD CONSTRAINT "transforms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volumes" ADD CONSTRAINT "volumes_exit_id_fkey" FOREIGN KEY ("exit_id") REFERENCES "exits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_logs" ADD CONSTRAINT "volume_logs_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_logs" ADD CONSTRAINT "volume_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_enters" ADD CONSTRAINT "volume_enters_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "enters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_exit_id_fkey" FOREIGN KEY ("exit_id") REFERENCES "exits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_exits" ADD CONSTRAINT "volume_exits_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
