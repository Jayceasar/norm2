-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "tags" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "cover" TEXT,
    "views" SERIAL NOT NULL,
    "favourited" SERIAL NOT NULL,
    "price" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animation" (
    "jsonData" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "sound" TEXT,
    "edits" SERIAL NOT NULL,
    "previewed" SERIAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Animation_productId_key" ON "Animation"("productId");

-- AddForeignKey
ALTER TABLE "Animation" ADD CONSTRAINT "Animation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
