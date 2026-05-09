-- CreateEnum
CREATE TYPE "EventKind" AS ENUM ('CONFLICT', 'ALLIANCE', 'MARRIAGE', 'SUCCESSION', 'OTHER');

-- CreateTable
CREATE TABLE "HistoricalEvent" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "endYear" INTEGER,
    "description" TEXT,
    "kind" "EventKind" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoricalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynastyEvent" (
    "dynastyId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "DynastyEvent_pkey" PRIMARY KEY ("dynastyId","eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalEvent_slug_key" ON "HistoricalEvent"("slug");

-- CreateIndex
CREATE INDEX "HistoricalEvent_slug_idx" ON "HistoricalEvent"("slug");

-- CreateIndex
CREATE INDEX "DynastyEvent_eventId_idx" ON "DynastyEvent"("eventId");

-- AddForeignKey
ALTER TABLE "DynastyEvent" ADD CONSTRAINT "DynastyEvent_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "Dynasty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynastyEvent" ADD CONSTRAINT "DynastyEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HistoricalEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
