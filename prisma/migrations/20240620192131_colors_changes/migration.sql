/*
  Warnings:

  - The values [ffcccc,cceeff,ccffcc,ffffcc,ffd9b3,e6ccff,ffccff,d9d9d9] on the enum `Colors` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Colors_new" AS ENUM ('RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'GRAY');
ALTER TABLE "User" ALTER COLUMN "profileColor" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "profileColor" TYPE "Colors_new" USING ("profileColor"::text::"Colors_new");
ALTER TYPE "Colors" RENAME TO "Colors_old";
ALTER TYPE "Colors_new" RENAME TO "Colors";
DROP TYPE "Colors_old";
ALTER TABLE "User" ALTER COLUMN "profileColor" SET DEFAULT 'GRAY';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileColor" SET DEFAULT 'GRAY';
