/*
  Warnings:

  - Made the column `created_at` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;
