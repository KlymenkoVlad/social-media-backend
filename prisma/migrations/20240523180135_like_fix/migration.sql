/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_post_id_key" ON "Like"("post_id");
