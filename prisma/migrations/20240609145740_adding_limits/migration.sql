/*
  Warnings:

  - You are about to alter the column `text` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "text" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(15);
