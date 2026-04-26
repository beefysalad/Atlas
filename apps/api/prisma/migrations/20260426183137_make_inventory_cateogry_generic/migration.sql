/*
  Warnings:

  - Changed the type of `category` on the `InventoryItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL;

-- DropEnum
DROP TYPE "InventoryCategory";

-- CreateIndex
CREATE INDEX "InventoryItem_category_idx" ON "InventoryItem"("category");
