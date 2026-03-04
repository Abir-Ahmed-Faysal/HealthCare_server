/*
  Warnings:

  - The values [CONFIRMED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('SCHEDULED', 'ONPROGRESS', 'COMPLETE', 'CANCELLED');
ALTER TABLE "public"."appointments" ALTER COLUMN "appointmentStatus" DROP DEFAULT;
ALTER TABLE "appointments" ALTER COLUMN "appointmentStatus" TYPE "AppointmentStatus_new" USING ("appointmentStatus"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "appointments" ALTER COLUMN "appointmentStatus" SET DEFAULT 'SCHEDULED';
COMMIT;
