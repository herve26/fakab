import { json } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import SupplierCard from "#app/components/molecules/supplier-card.tsx"
import { supabaseClient } from "#app/utils/supa.server.ts"

export async function loader(){
    const suppliers = await supabaseClient.from("supplier").select()

    return json({suppliers: suppliers.data ?? []})
}

export default function SupplierIndex(){
    const { suppliers } = useLoaderData<typeof loader>() 
    return(
        <div className="flex">
            <div className="border border-red-500 px-8 grow">
                <Link to="new" className="border border-red-500">New</Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {suppliers.map((supplier) => (
                        <SupplierCard key={supplier.supplierid} supplier={supplier} />
                    ))}
                </div>
            </div>
            <Outlet/>
        </div>
    )
}