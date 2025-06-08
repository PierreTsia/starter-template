-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailConfirmationToken" TEXT,
ADD COLUMN     "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
