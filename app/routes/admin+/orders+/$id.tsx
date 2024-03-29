import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import MerchantOrderDetail from "#app/components/molecules/merchant-order-detail.tsx"
import RefillOrderDetail from "#app/components/molecules/refill-order-detail.tsx"
import { supabaseClient } from "#app/utils/supa.server.ts"

export async function loader({params}: LoaderFunctionArgs){
    const id = params.id

    if(!id){
        throw new Error("ID is mandatory")
    }
    
    try {
        const numId = parseInt(id)

        const { data, error } = await supabaseClient.from("order").select(`
            *,
            supplier(*),
            details:order_detail(*, material(*))
        `).eq("orderid", numId).single()

        if(error || data === null) {
            console.error("Unable to get Table order_summary", error)
            throw Error("Unable to Get Order")
        }
        
        return json({order: data})

    } catch(e){
        throw Error("Unable to Get Order")
    }
}

export default function OrderDetail(){
    const { order } = useLoaderData<typeof loader>()
    return (
        <div className="ml-6 w-[46vw] bg-white shadow-lg rounded-md p-4">
            <h2 className="text-2xl font-bold mb-4">Order #{order.orderid}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-sm border border-slate-300 p-4">
                    <h4 className="text-lg mb-2">Order Date</h4>
                    <p className="text-gray-700">{new Date(order.order_date).toLocaleDateString()}</p>
                </div>

                <div className="bg-white rounded-sm border border-slate-300 p-4">
                    <h4 className="text-lg mb-2">Supplier</h4>
                    <p className="text-gray-700">
                        {order.supplier?.supplier_name || 'N/A'}
                    </p>
                </div>
            </div>

            {order.supplier?.supplier_type === "MERCHANT" && <MerchantOrderDetail details={order.details.map(det => ({materialName: det.material?.material_name, unitPrice: det.unit_price, quantity: det.order_quantity}))} />}
            {order.supplier?.supplier_type === "REFILL" && <RefillOrderDetail details={order.details.map(det => ({material: det.material?.material_name, quantity: det.order_quantity}))}/>}
        </div>
    )
}