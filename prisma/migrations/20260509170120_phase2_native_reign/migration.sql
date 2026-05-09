-- AlterTable
ALTER TABLE "Dynasty" ADD COLUMN     "coatOfArmsUrl" TEXT,
ADD COLUMN     "nativeName" TEXT;

-- AlterTable
ALTER TABLE "HistoricalFigure" ADD COLUMN     "nativeName" TEXT,
ADD COLUMN     "reignEnd" INTEGER,
ADD COLUMN     "reignStart" INTEGER;
