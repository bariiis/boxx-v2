/*
  Warnings:

  - You are about to drop the `benchmark_entries` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[quoteId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicToken]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicToken` was added to the `tickets` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "SpecFieldType" AS ENUM ('TEXT', 'TEXTAREA', 'SELECT');

-- DropForeignKey
ALTER TABLE "benchmark_entries" DROP CONSTRAINT "benchmark_entries_chartId_fkey";

-- AlterTable
ALTER TABLE "benchmark_charts" ADD COLUMN     "labels" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "productId" TEXT,
ALTER COLUMN "solutionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "contactId" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "quoteId" TEXT,
ADD COLUMN     "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
ALTER COLUMN "currency" SET DEFAULT 'USD';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "features" JSONB,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "heroVideo" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "quotes" ALTER COLUMN "currency" SET DEFAULT 'USD';

-- AlterTable
ALTER TABLE "serial_numbers" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "solution_categories" ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "intro" TEXT,
ADD COLUMN     "subtitle" TEXT;

-- AlterTable
ALTER TABLE "solutions" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "publicToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organizationId" TEXT;

-- DropTable
DROP TABLE "benchmark_entries";

-- CreateTable
CREATE TABLE "shipping_addresses" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "district" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Türkiye',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sections" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL DEFAULT 'CUSTOM',
    "tabKey" TEXT NOT NULL,
    "tabLabel" TEXT NOT NULL,
    "content" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_faqs" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spec_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_preset_fields" (
    "id" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "fieldType" "SpecFieldType" NOT NULL DEFAULT 'TEXT',
    "options" JSONB,
    "defaultValue" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "spec_preset_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solution_products" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "solution_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmark_datasets" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "values" TEXT NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "benchmark_datasets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_sections_productId_tabKey_key" ON "product_sections"("productId", "tabKey");

-- CreateIndex
CREATE UNIQUE INDEX "solution_products_solutionId_productId_key" ON "solution_products"("solutionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_quoteId_key" ON "orders"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_publicToken_key" ON "tickets"("publicToken");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sections" ADD CONSTRAINT "product_sections_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_faqs" ADD CONSTRAINT "product_faqs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec_preset_fields" ADD CONSTRAINT "spec_preset_fields_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "spec_presets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serial_numbers" ADD CONSTRAINT "serial_numbers_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solution_products" ADD CONSTRAINT "solution_products_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solution_products" ADD CONSTRAINT "solution_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benchmark_charts" ADD CONSTRAINT "benchmark_charts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benchmark_datasets" ADD CONSTRAINT "benchmark_datasets_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "benchmark_charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
