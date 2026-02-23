/*
  Warnings:

  - The primary key for the `doctor_specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `doctor_specialties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("doctorId", "specialtyId");
