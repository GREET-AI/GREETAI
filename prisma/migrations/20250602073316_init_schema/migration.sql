-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" JSONB,
ADD COLUMN     "rank" TEXT NOT NULL DEFAULT 'Deadass Rookie',
ADD COLUMN     "rankProgress" JSONB,
ADD COLUMN     "totalLaunches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalShills" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;
