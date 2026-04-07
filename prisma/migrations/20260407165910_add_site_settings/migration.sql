-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "logoUrl" TEXT,
    "logoText" TEXT,
    "headerMenu" TEXT NOT NULL DEFAULT '[]',
    "headerCtaText" TEXT,
    "headerCtaHref" TEXT,
    "footerLogoUrl" TEXT,
    "footerTagline" TEXT,
    "footerColumns" TEXT NOT NULL DEFAULT '[]',
    "footerBottom" TEXT,
    "socialLinks" TEXT NOT NULL DEFAULT '[]',
    "siteName" TEXT,
    "defaultMetaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
