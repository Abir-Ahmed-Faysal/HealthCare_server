/*
  Warnings:

  - You are about to drop the column `paymentGatewayDate` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "pdfUrl" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentGatewayDate",
ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "paymentGatewayData" JSONB;
