import { invariantResponse } from "@epic-web/invariant"
import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import MerchantOrderDetail from "#app/components/molecules/merchant-order-detail.tsx"
import RefillOrderDetail from "#app/components/molecules/refill-order-detail.tsx"
import { prisma } from "#app/utils/db.server.ts"

export async function loader({params}: LoaderFunctionArgs){
    const id = params.id
    invariantResponse(id, "Order ID is mandatory")
    
    try {
        const numId = parseInt(id)
        const order = await prisma.order.findUnique({
            where: {
                orderId: numId
            },
            include: {
                supplier: true,
                details: {
                    include: {
                        material: true
                    }
                }
            }
        })

        if(order === null) throw Error("Unable to Get Order")
        
        return json({order})

    } catch(e){
        throw Error("Unable to Get Order")
    }
}

export default function OrderDetail(){
    const { order } = useLoaderData<typeof loader>()
    return (
        <div className="ml-6 w-[46vw] bg-white shadow-lg rounded-md p-4">
            <h2 className="text-2xl font-bold mb-4">Order #{order.orderId}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-sm border border-slate-300 p-4">
                    <h4 className="text-lg mb-2">Order Date</h4>
                    <p className="text-gray-700">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>

                <div className="bg-white rounded-sm border border-slate-300 p-4">
                    <h4 className="text-lg mb-2">Supplier</h4>
                    <p className="text-gray-700">
                        {order.supplier?.supplierName || 'N/A'}
                    </p>
                </div>
            </div>

            {order.supplier?.supplierType === "MERCHANT" && <MerchantOrderDetail details={order.details.map(det => ({materialName: det.material.materialName, unitPrice: det.unitPrice, quantity: det.orderQuantity}))} />}
            {order.supplier?.supplierType === "REFILL" && <RefillOrderDetail details={order.details.map(det => ({material: det.material.materialName, quantity: det.orderQuantity}))}/>}
        </div>
    )
}