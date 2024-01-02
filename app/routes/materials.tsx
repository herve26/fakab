import { type Material } from "@prisma/client";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ScreenView from "#app/components/screen-view.tsx";
import Table from "#app/components/table.tsx";
import { prisma } from "#app/utils/db.server.ts";

interface MaterialInStock extends Material {
    inStock: string
}

export async function loader(){
    const materials = await prisma.$queryRaw<MaterialInStock[]>`
        SELECT
    m.materialId,
    m.materialName,
    m.materialCode,
    m.materialDesc,
    mu.unitName AS materialUnit,
    SUM(od_agg.totalOrdered) AS totalOrdered,
    COALESCE(SUM(mu.quantity), 0) AS totalUsed,
    SUM(od_agg.totalOrdered) - COALESCE(SUM(mu.quantity), 0) AS inStock
FROM Material m
JOIN MaterialUnit mu ON m.materialUnitCode = mu.unitCode
LEFT JOIN (
    SELECT materialId, SUM(orderQuantity) AS totalOrdered
    FROM OrderDetail
    GROUP BY materialId
) od_agg ON m.materialId = od_agg.materialId
LEFT JOIN MaterialUsed mu ON m.materialId = mu.materialId
GROUP BY m.materialId, m.materialName, m.materialCode, m.materialDesc, mu.unitName
HAVING inStock > 0
ORDER BY m.materialName;
    `

    console.log(materials)

    const matArr = materials.map(mat => (
        [mat.materialCode, mat.materialName, mat.materialUnitCode, parseInt(mat.inStock)]
    ))

    return json({materials: matArr})
}

export default function MaterialIndex(){
    const { materials } = useLoaderData<typeof loader>()

    return (
        <div className="flex px-8 space-y-2 space-x-6 my-4">
            <ScreenView link="new" heading="Materials">
                <Table
                    headers={["Code", "Name", "Unit", "Qty Stock"]}
                    children={materials}
                />
            </ScreenView>
            <Outlet/>
        </div>
    )
}