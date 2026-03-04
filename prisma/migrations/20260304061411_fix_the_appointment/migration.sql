/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `appointments` table. All the data in the column will be lost.
  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "paymentStatus",
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
