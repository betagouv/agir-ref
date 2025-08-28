-- This is an empty migration.
CREATE INDEX location_idx ON "ActeurLVAO" USING GIST (geography(geom));