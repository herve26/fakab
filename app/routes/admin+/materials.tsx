import { invariantResponse } from "@epic-web/invariant";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ScreenView from "#app/components/screen-view.tsx";
import Table from "#app/components/table.tsx";
import { supabaseClient } from "#app/utils/supa.server.ts";

/**
 * The loader function for the materials route.
 * It fetches the list of materials from the database.
 *
 * @returns {Promise<Response>} A promise that resolves with the response.
 */
export async function loader(){
    const materials = await supabaseClient.from("material_inventory").select()

    invariantResponse(materials.data, "Unable to Get Material")

    const matArr = materials.data.map(mat => {
        if(!mat.material_code || !mat.material_name || !mat.materialunit) return undefined
        return [mat.material_code, mat.material_name, mat.materialunit, mat.instock ?? 0]
    }).filter(mat => mat !== undefined)

    return json({materials: matArr})
}

/**
 * The component for the materials route.
 * It displays a list of materials in a table.
 *
 * @returns {JSX.Element} The material index component.
 */
export default function MaterialIndex(){
    const { materials } = useLoaderData<typeof loader>()

    return (
        <div className="flex px-8 space-y-2 space-x-6 my-4">
            <ScreenView link="new" heading="Materials">
                <Table
                    headers={["Code", "Name", "Unit", "Qty Stock"]}
                >{materials}</Table>
            </ScreenView>
            <Outlet/>
        </div>
    )
}