-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN "unitPrice" DECIMAL;

-- CreateTable
CREATE TABLE "Supplier" (
    "supplierId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplierName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "supplierType" TEXT NOT NULL DEFAULT 'MERCHANT'
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "orderId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderDate" DATETIME NOT NULL,
    "supplierId" INTEGER,
    CONSTRAINT "Order_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("supplierId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("orderDate", "orderId") SELECT "orderDate", "orderId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
