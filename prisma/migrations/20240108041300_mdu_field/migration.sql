-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerConnections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "so" TEXT NOT NULL,
    "customer_details" TEXT NOT NULL,
    "customer_contact" TEXT NOT NULL,
    "customer_address" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "geo_localization" TEXT NOT NULL,
    "connection_type" TEXT NOT NULL,
    "has_mdu" BOOLEAN NOT NULL DEFAULT false,
    "assignement_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_date" DATETIME,
    "teamId" INTEGER,
    CONSTRAINT "CustomerConnections_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CustomerConnections" ("area", "assignement_date", "completion_date", "connection_type", "customer_address", "customer_contact", "customer_details", "geo_localization", "id", "so", "teamId") SELECT "area", "assignement_date", "completion_date", "connection_type", "customer_address", "customer_contact", "customer_details", "geo_localization", "id", "so", "teamId" FROM "CustomerConnections";
DROP TABLE "CustomerConnections";
ALTER TABLE "new_CustomerConnections" RENAME TO "CustomerConnections";
CREATE UNIQUE INDEX "CustomerConnections_so_key" ON "CustomerConnections"("so");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
