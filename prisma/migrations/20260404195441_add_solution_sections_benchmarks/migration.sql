/*
  Warnings:

  - You are about to drop the column `content` on the `solutions` table. All the data in the column will be lost.
  - You are about to drop the column `contentEn` on the `solutions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "solutions" DROP COLUMN "content",
DROP COLUMN "contentEn",
ADD COLUMN     "subtitle" TEXT;

-- CreateTable
CREATE TABLE "solution_sections" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "tabKey" TEXT NOT NULL,
    "tabLabel" TEXT NOT NULL,
    "content" TEXT,
    "contentEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "solution_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmark_charts" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "chartType" TEXT NOT NULL DEFAULT 'bar',
    "unit" TEXT NOT NULL DEFAULT 'points',
    "sectionKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "benchmark_charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmark_entries" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "benchmark_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "solution_sections_solutionId_tabKey_key" ON "solution_sections"("solutionId", "tabKey");

-- AddForeignKey
ALTER TABLE "solution_sections" ADD CONSTRAINT "solution_sections_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benchmark_charts" ADD CONSTRAINT "benchmark_charts_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benchmark_entries" ADD CONSTRAINT "benchmark_entries_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "benchmark_charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
