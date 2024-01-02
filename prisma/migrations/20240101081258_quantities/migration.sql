-- CreateTable
CREATE TABLE "MaterialUsed" (
    "customerId" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("customerId", "materialId"),
    CONSTRAINT "MaterialUsed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerConnections" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaterialUsed_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("materialId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMaterials" (
    "teamId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("teamId", "materialId"),
    CONSTRAINT "TeamMaterials_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamMaterials_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("materialId") ON DELETE RESTRICT ON UPDATE CASCADE
);
