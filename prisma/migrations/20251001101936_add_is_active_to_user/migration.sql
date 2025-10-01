-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "passwordHash" SET DEFAULT 'changeme';
