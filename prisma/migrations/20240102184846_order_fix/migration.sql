-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "orderId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "supplierId" INTEGER,
    CONSTRAINT "Order_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("supplierId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("orderDate", "orderId", "supplierId") SELECT "orderDate", "orderId", "supplierId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_OrderDetail" (
    "orderDetailId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderQuantity" INTEGER NOT NULL,
    "receivedData" DATETIME,
    "orderId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "unitPrice" DECIMAL,
    CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("materialId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetail" ("materialId", "orderDetailId", "orderId", "orderQuantity", "receivedData", "unitPrice") SELECT "materialId", "orderDetailId", "orderId", "orderQuantity", "receivedData", "unitPrice" FROM "OrderDetail";
DROP TABLE "OrderDetail";
ALTER TABLE "new_OrderDetail" RENAME TO "OrderDetail";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
