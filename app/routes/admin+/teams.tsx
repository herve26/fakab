import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Table from "#app/components/table.tsx";
import { supabaseClient } from "#app/utils/supa.server.ts";

export async function loader(){
    const { data } = await supabaseClient.from("team_summary").select()
    
    if(!data){
        return json({teams: null})
    }

    const teamArr = data.map(({team_name, incharge_first_name, incharge_last_name, member_count}) => (
        [team_name, `${incharge_first_name} ${incharge_last_name}`, member_count]
    ))


    return json({teams: teamArr})
}

export default function TeamIndex(){
    const { teams } = useLoaderData<typeof loader>()

    return (
        <div className="flex px-8 space-x-4">
            <div className="w-full">
                <div className="flex space-x-4">
                    <h1 className="text-2xl font-bold">Teams</h1>
                    <Link className="text-2xl font-bold border border-primary" to="new">+</Link>
                </div>
                <div className="py-2 align-middle inline-block min-w-full">
                    <Table headers={["Name", "In Charge", "# Members"]}>{teams}</Table>
                </div>
            </div>
            <Outlet/>
        </div>
        
    )
}