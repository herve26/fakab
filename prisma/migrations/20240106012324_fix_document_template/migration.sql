/*
  Warnings:

  - Added the required column `documentCode` to the `DocumentTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DocumentTemplate" (
    "documentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documentName" TEXT NOT NULL,
    "documentDesc" TEXT,
    "documentCode" TEXT NOT NULL,
    "documentType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DocumentTemplate" ("createdAt", "documentDesc", "documentId", "documentName", "documentType", "updatedAt") SELECT "createdAt", "documentDesc", "documentId", "documentName", "documentType", "updatedAt" FROM "DocumentTemplate";
DROP TABLE "DocumentTemplate";
ALTER TABLE "new_DocumentTemplate" RENAME TO "DocumentTemplate";
CREATE UNIQUE INDEX "DocumentTemplate_documentName_key" ON "DocumentTemplate"("documentName");
CREATE UNIQUE INDEX "DocumentTemplate_documentCode_key" ON "DocumentTemplate"("documentCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
