import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import SupplierCard from "#app/components/molecules/supplier-card.tsx"
import { prisma } from "#app/utils/db.server.ts"

export async function loader(){
    const suppliers = await prisma.supplier.findMany()

    return json({suppliers})
}
export default function SupplierIndex(){
    const { suppliers } = useLoaderData<typeof loader>() 
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
                <SupplierCard key={supplier.supplierId} supplier={supplier} />
            ))}
        </div>
    )
}