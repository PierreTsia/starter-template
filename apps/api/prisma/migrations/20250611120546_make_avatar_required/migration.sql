/*
  Warnings:

  - Made the column `avatarUrl` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- Update NULL values to default
UPDATE "users" SET "avatarUrl" = 'https://api.dicebear.com/7.x/identicon/svg?seed=default' WHERE "avatarUrl" IS NULL;

-- Make column required
ALTER TABLE "users" ALTER COLUMN "avatarUrl" SET NOT NULL;
