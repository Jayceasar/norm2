/*
  Warnings:

  - You are about to drop the `ProjectAnimation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectAnimation" DROP CONSTRAINT "ProjectAnimation_parent_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "jsonData" TEXT;

-- DropTable
DROP TABLE "ProjectAnimation";
