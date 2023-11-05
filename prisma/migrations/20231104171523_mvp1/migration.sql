/*
  Warnings:

  - You are about to drop the column `jsonData` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "jsonData";

-- CreateTable
CREATE TABLE "ProjectAnimation" (
    "id" SERIAL NOT NULL,
    "jsonData" TEXT[],
    "parent" INTEGER NOT NULL,

    CONSTRAINT "ProjectAnimation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectAnimation" ADD CONSTRAINT "ProjectAnimation_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
