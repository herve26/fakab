-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT NOT NULL,
    "materialDesc" TEXT,
    "materialUnit" TEXT NOT NULL
);
INSERT INTO "new_Material" ("id", "materialCode", "materialDesc", "materialName", "materialUnit") SELECT "id", "materialCode", "materialDesc", "materialName", "materialUnit" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
CREATE UNIQUE INDEX "Material_materialName_key" ON "Material"("materialName");
CREATE UNIQUE INDEX "Material_materialCode_key" ON "Material"("materialCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
