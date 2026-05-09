-- CreateTable
CREATE TABLE "Dynasty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "region" TEXT,
    "foundedYear" INTEGER,
    "endedYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dynasty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalFigure" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "biography" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dynastyId" INTEGER,

    CONSTRAINT "HistoricalFigure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentChild" (
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,

    CONSTRAINT "ParentChild_pkey" PRIMARY KEY ("parentId","childId")
);

-- CreateTable
CREATE TABLE "Spouse" (
    "aId" INTEGER NOT NULL,
    "bId" INTEGER NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,

    CONSTRAINT "Spouse_pkey" PRIMARY KEY ("aId","bId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dynasty_slug_key" ON "Dynasty"("slug");

-- CreateIndex
CREATE INDEX "Dynasty_slug_idx" ON "Dynasty"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalFigure_slug_key" ON "HistoricalFigure"("slug");

-- CreateIndex
CREATE INDEX "HistoricalFigure_slug_idx" ON "HistoricalFigure"("slug");

-- CreateIndex
CREATE INDEX "HistoricalFigure_dynastyId_idx" ON "HistoricalFigure"("dynastyId");

-- CreateIndex
CREATE INDEX "ParentChild_childId_idx" ON "ParentChild"("childId");

-- CreateIndex
CREATE INDEX "Spouse_bId_idx" ON "Spouse"("bId");

-- AddForeignKey
ALTER TABLE "HistoricalFigure" ADD CONSTRAINT "HistoricalFigure_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "Dynasty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentChild" ADD CONSTRAINT "ParentChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "HistoricalFigure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentChild" ADD CONSTRAINT "ParentChild_childId_fkey" FOREIGN KEY ("childId") REFERENCES "HistoricalFigure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spouse" ADD CONSTRAINT "Spouse_aId_fkey" FOREIGN KEY ("aId") REFERENCES "HistoricalFigure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spouse" ADD CONSTRAINT "Spouse_bId_fkey" FOREIGN KEY ("bId") REFERENCES "HistoricalFigure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
