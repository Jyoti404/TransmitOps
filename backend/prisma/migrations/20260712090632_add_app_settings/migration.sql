-- CreateTable
CREATE TABLE "app_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "depotName" TEXT NOT NULL DEFAULT 'Main Depot',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "distanceUnit" TEXT NOT NULL DEFAULT 'KM',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);
