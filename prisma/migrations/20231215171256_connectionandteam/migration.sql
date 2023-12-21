-- CreateTable
CREATE TABLE "CustomerConnections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "so" TEXT NOT NULL,
    "customer_details" TEXT NOT NULL,
    "customer_contact" TEXT NOT NULL,
    "customer_address" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "geo_localization" TEXT NOT NULL,
    "connection_type" TEXT NOT NULL,
    "assignement_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_date" DATETIME,
    "teamId" INTEGER,
    CONSTRAINT "CustomerConnections_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "inChargeOfId" INTEGER,
    "teamId" INTEGER,
    CONSTRAINT "User_inChargeOfId_fkey" FOREIGN KEY ("inChargeOfId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "updatedAt", "username") SELECT "createdAt", "email", "id", "name", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_inChargeOfId_key" ON "User"("inChargeOfId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CustomerConnections_so_key" ON "CustomerConnections"("so");
