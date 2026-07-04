-- AlterTable
ALTER TABLE "component_specs" ADD COLUMN     "idleWatts" INTEGER,
ADD COLUMN     "lengthMm" INTEGER,
ADD COLUMN     "pcieLanesUsed" INTEGER,
ADD COLUMN     "pcieSlotWidth" DOUBLE PRECISION,
ADD COLUMN     "psuWatts" INTEGER,
ADD COLUMN     "ramCapacityGb" INTEGER,
ADD COLUMN     "socketRequired" TEXT,
ADD COLUMN     "storageGb" INTEGER,
ADD COLUMN     "storageInterface" TEXT;

-- CreateTable
CREATE TABLE "configurator_options" (
    "id" TEXT NOT NULL,
    "basekitId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priceDelta" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "affectsResources" BOOLEAN NOT NULL DEFAULT true,
    "minQty" INTEGER NOT NULL DEFAULT 0,
    "maxQty" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configurator_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "configurator_options_basekitId_category_idx" ON "configurator_options"("basekitId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "configurator_options_basekitId_componentId_category_key" ON "configurator_options"("basekitId", "componentId", "category");

-- AddForeignKey
ALTER TABLE "configurator_options" ADD CONSTRAINT "configurator_options_basekitId_fkey" FOREIGN KEY ("basekitId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configurator_options" ADD CONSTRAINT "configurator_options_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
