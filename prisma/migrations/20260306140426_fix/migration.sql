/*
  Warnings:

  - You are about to drop the column `dasAllergies` on the `patient_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `hsaDiabetes` on the `patient_health_data` table. All the data in the column will be lost.
  - Added the required column `hasAllergies` to the `patient_health_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasDiabetes` to the `patient_health_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patient_health_data" DROP COLUMN "dasAllergies",
DROP COLUMN "hsaDiabetes",
ADD COLUMN     "hasAllergies" BOOLEAN NOT NULL,
ADD COLUMN     "hasDiabetes" BOOLEAN NOT NULL;
