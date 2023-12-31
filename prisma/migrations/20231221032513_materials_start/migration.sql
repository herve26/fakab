-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT NOT NULL,
    "materialDesc" TEXT NOT NULL,
    "materialUnit" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_materialName_key" ON "Material"("materialName");

-- CreateIndex
CREATE UNIQUE INDEX "Material_materialCode_key" ON "Material"("materialCode");
