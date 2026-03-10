/*
  Warnings:

  - The `averageRating` column on the `doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "averageRating",
ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
