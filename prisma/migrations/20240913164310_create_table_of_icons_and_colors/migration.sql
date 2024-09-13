/*
  Warnings:

  - You are about to drop the column `color` on the `payCategories` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `payCategories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name,colorId,iconId]` on the table `payCategories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `colorId` to the `payCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconId` to the `payCategories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payCategories_userId_name_color_img_key";

-- AlterTable
ALTER TABLE "payCategories" DROP COLUMN "color",
DROP COLUMN "img",
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "iconId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "icons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colors_hex_key" ON "colors"("hex");

-- CreateIndex
CREATE UNIQUE INDEX "icons_name_key" ON "icons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payCategories_userId_name_colorId_iconId_key" ON "payCategories"("userId", "name", "colorId", "iconId");

-- AddForeignKey
ALTER TABLE "payCategories" ADD CONSTRAINT "payCategories_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payCategories" ADD CONSTRAINT "payCategories_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "icons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
