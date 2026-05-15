-- CreateTable
CREATE TABLE "FigureEvent" (
    "figureId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "FigureEvent_pkey" PRIMARY KEY ("figureId","eventId")
);

-- CreateIndex
CREATE INDEX "FigureEvent_eventId_idx" ON "FigureEvent"("eventId");

-- AddForeignKey
ALTER TABLE "FigureEvent" ADD CONSTRAINT "FigureEvent_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "HistoricalFigure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FigureEvent" ADD CONSTRAINT "FigureEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HistoricalEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
