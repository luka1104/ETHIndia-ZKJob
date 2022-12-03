/*
  Warnings:

  - You are about to drop the column `imagePath` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `IntroCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntroCard" DROP CONSTRAINT "IntroCard_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imagePath";

-- DropTable
DROP TABLE "IntroCard";

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "videoPath" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
