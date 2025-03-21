/*
  Warnings:

  - Made the column `resetTokenExpiry` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetTokenExpiry" SET NOT NULL;
