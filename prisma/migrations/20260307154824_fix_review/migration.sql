/*
  Warnings:

  - You are about to drop the column `review` on the `reviews` table. All the data in the column will be lost.
  - Changed the type of `rating` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "review",
ADD COLUMN     "comment" TEXT,
DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;
