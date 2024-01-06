/*
  Warnings:

  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Resource";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Template";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DocumentTemplate" (
    "documentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documentName" TEXT NOT NULL,
    "documentDesc" TEXT,
    "documentType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocumentResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "customerId" TEXT,
    "documentTemplateId" INTEGER,
    CONSTRAINT "DocumentResource_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerConnections" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DocumentResource_documentTemplateId_fkey" FOREIGN KEY ("documentTemplateId") REFERENCES "DocumentTemplate" ("documentId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentTemplate_documentName_key" ON "DocumentTemplate"("documentName");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentResource_documentTemplateId_key" ON "DocumentResource"("documentTemplateId");
