-- CreateTable
CREATE TABLE "ActeurLVAO" (
    "id" TEXT NOT NULL,
    "sources" TEXT[],
    "nom" TEXT,
    "nom_commercial" TEXT,
    "siren" TEXT,
    "siret" TEXT,
    "description" TEXT,
    "type_acteur" TEXT,
    "url" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "complement_adresse" TEXT,
    "code_postal" TEXT,
    "ville" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "labels" TEXT[],
    "type_public" TEXT,
    "reprise" TEXT,
    "reprise_exclusif" BOOLEAN,
    "sur_rdv" BOOLEAN,
    "types_service" TEXT[],
    "detail_services" JSONB NOT NULL DEFAULT '{}',
    "date_derniere_maj" TIMESTAMPTZ(3) NOT NULL,
    "emprunter" TEXT[],
    "preter" TEXT[],
    "louer" TEXT[],
    "mettreenlocation" TEXT[],
    "reparer" TEXT[],
    "donner" TEXT[],
    "trier" TEXT[],
    "echanger" TEXT[],
    "revendre" TEXT[],
    "acheter" TEXT[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActeurLVAO_pkey" PRIMARY KEY ("id")
);
