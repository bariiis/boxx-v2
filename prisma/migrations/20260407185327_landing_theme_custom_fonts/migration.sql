-- AlterTable
ALTER TABLE "landing_pages" ADD COLUMN     "theme" TEXT;

-- CreateTable
CREATE TABLE "custom_fonts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 400,
    "style" TEXT NOT NULL DEFAULT 'normal',
    "fileUrl" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'woff2',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_fonts_pkey" PRIMARY KEY ("id")
);
