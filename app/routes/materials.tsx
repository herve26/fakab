import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ScreenView from "#app/components/screen-view.tsx";
import Table from "#app/components/table.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader(){
    // const materials = [["Pigtail", "Piece", 3]]
    const materials = await prisma.material.findMany({
        include: {
            orderDetail: {
                select: {
                    orderQuantity: true
                }
            }
        }
    })

    const matArr = materials.map(mat => (
        [mat.materialCode, mat.materialName, mat.materialUnitCode, mat.orderDetail.reduce((acc, cur) => ({orderQuantity: acc.orderQuantity + cur.orderQuantity}), {orderQuantity: 0}).orderQuantity]
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