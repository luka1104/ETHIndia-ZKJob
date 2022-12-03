/*
  Warnings:

  - You are about to drop the column `isCompany` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `isCompany` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "isCompany";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isCompany";
