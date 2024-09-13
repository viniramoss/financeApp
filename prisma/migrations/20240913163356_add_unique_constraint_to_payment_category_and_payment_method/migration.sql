/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,color,img]` on the table `payCategories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `payMethod` will be added. If there are existing duplicate values, this will fail.
  - Made the column `img` on table `payCategories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `payCategories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payCategories" ALTER COLUMN "img" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payCategories_userId_name_color_img_key" ON "payCategories"("userId", "name", "color", "img");

-- CreateIndex
CREATE UNIQUE INDEX "payMethod_userId_name_key" ON "payMethod"("userId", "name");
