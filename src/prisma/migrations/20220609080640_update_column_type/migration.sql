/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SubReddit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `UserRefreshToken_token_key` ON `userrefreshtoken`;

-- AlterTable
ALTER TABLE `post` MODIFY `content` TEXT NULL;

-- AlterTable
ALTER TABLE `subreddit` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `userrefreshtoken` MODIFY `token` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SubReddit_name_key` ON `SubReddit`(`name`);
