/*
  Warnings:

  - You are about to drop the column `receivedData` on the `OrderDetail` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderDetail" (
    "orderDetailId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderQuantity" INTEGER NOT NULL,
    "receivedDate" DATETIME,
    "orderId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "unitPrice" DECIMAL,
    CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("materialId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetail" ("materialId", "orderDetailId", "orderId", "orderQuantity", "unitPrice") SELECT "materialId", "orderDetailId", "orderId", "orderQuantity", "unitPrice" FROM "OrderDetail";
DROP TABLE "OrderDetail";
ALTER TABLE "new_OrderDetail" RENAME TO "OrderDetail";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
