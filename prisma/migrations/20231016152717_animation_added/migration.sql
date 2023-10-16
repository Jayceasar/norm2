-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cover" TEXT,
ADD COLUMN     "favourited" SERIAL NOT NULL,
ADD COLUMN     "views" SERIAL NOT NULL;

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
