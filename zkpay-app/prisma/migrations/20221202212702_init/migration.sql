-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "isCompany" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntroCard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "imagePaths" TEXT[],
    "videoPath" TEXT NOT NULL,

    CONSTRAINT "IntroCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "IntroCard_userId_key" ON "IntroCard"("userId");

-- AddForeignKey
ALTER TABLE "IntroCard" ADD CONSTRAINT "IntroCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
