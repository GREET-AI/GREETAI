-- AlterTable
ALTER TABLE "User" ADD COLUMN     "greetBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalGreetEarned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPostsMade" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "LaunchedToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "platform" TEXT NOT NULL,
    "launchpadId" TEXT,
    "launchpadUrl" TEXT,
    "website" TEXT,
    "twitterUrl" TEXT,
    "telegramUrl" TEXT,
    "totalSupply" TEXT,
    "decimals" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "launchDate" TIMESTAMP(3),
    "liveDate" TIMESTAMP(3),
    "marketCap" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "volume24h" DOUBLE PRECISION,
    "holders" INTEGER,
    "lastApiCheck" TIMESTAMP(3),
    "apiData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaunchedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postLink" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'VERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LaunchedToken_userId_idx" ON "LaunchedToken"("userId");

-- CreateIndex
CREATE INDEX "LaunchedToken_platform_idx" ON "LaunchedToken"("platform");

-- CreateIndex
CREATE INDEX "LaunchedToken_status_idx" ON "LaunchedToken"("status");

-- CreateIndex
CREATE INDEX "LaunchedToken_launchDate_idx" ON "LaunchedToken"("launchDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserPost_postLink_key" ON "UserPost"("postLink");

-- CreateIndex
CREATE INDEX "UserPost_userId_idx" ON "UserPost"("userId");

-- CreateIndex
CREATE INDEX "UserPost_postLink_idx" ON "UserPost"("postLink");

-- CreateIndex
CREATE INDEX "UserPost_timestamp_idx" ON "UserPost"("timestamp");

-- AddForeignKey
ALTER TABLE "LaunchedToken" ADD CONSTRAINT "LaunchedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
