import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Table from "#app/components/table.tsx";

export async function loader(){
    const materials = [["Pigtail", "Piece", 3]]

    return json({materials})
}

export default function MaterialIndex(){
    const { materials } = useLoaderData<typeof loader>()

    return (
        <div className="flex px-8 py-6">
            <Table
                headers={["Description", "Unit", "Quanity"]}
                children={materials}
            />
        </div>
    )
}