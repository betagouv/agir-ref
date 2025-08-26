-- CREATE EXTENSION
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "ActeurLVAO" ADD COLUMN     "geom" geometry(Point, 4326);

-- CreateIndex
CREATE INDEX "location_idx" ON "ActeurLVAO" USING GIST ("geom");
