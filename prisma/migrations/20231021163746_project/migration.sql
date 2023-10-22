-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "cover" TEXT,
    "jsonData" TEXT,
    "template" TEXT,
    "sound" TEXT,
    "scenes" TEXT[],
    "firebaseJSONURL" TEXT,
    "owner" TEXT NOT NULL,
    "collaborators" TEXT[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
