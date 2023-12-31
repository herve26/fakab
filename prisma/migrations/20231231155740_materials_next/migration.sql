/*
  Warnings:

  - The primary key for the `Material` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `materialUnit` on the `Material` table. All the data in the column will be lost.
  - Added the required column `materialId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialUnitCode` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MaterialUnit" (
    "unitCode" TEXT NOT NULL PRIMARY KEY,
    "unitName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "orderDetailId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderQuantity" INTEGER NOT NULL,
    "receivedData" DATETIME NOT NULL,
    "orderId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("materialId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Material" (
    "materialId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT NOT NULL,
    "materialDesc" TEXT,
    "materialUnitCode" TEXT NOT NULL,
    CONSTRAINT "Material_materialUnitCode_fkey" FOREIGN KEY ("materialUnitCode") REFERENCES "MaterialUnit" ("unitCode") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Material" ("materialCode", "materialDesc", "materialName") SELECT "materialCode", "materialDesc", "materialName" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
CREATE UNIQUE INDEX "Material_materialName_key" ON "Material"("materialName");
CREATE UNIQUE INDEX "Material_materialCode_key" ON "Material"("materialCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
