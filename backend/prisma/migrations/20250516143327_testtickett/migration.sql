/*
  Warnings:

  - The values [VALID,EXPIRED,USED,CANCELLED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SINGLE,WEEKLY,MONTHLY] on the enum `TicketType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('valid', 'expired', 'used', 'cancelled');
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TicketType_new" AS ENUM ('single', 'weekly', 'monthly');
ALTER TABLE "Ticket" ALTER COLUMN "type" TYPE "TicketType_new" USING ("type"::text::"TicketType_new");
ALTER TYPE "TicketType" RENAME TO "TicketType_old";
ALTER TYPE "TicketType_new" RENAME TO "TicketType";
DROP TYPE "TicketType_old";
COMMIT;
