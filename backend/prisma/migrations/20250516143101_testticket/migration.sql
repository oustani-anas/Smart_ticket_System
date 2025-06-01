/*
  Warnings:

  - Changed the type of `type` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('SINGLE', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('VALID', 'EXPIRED', 'USED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "type",
ADD COLUMN     "type" "TicketType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
