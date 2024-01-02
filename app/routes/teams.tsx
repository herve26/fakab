import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Table from "#app/components/table.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader(){
    const teams = await prisma.team.findMany({
        select: {
            id: true,
            name: true,
            inCharge: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            _count: {
                select: {
                    members: true
                }
            }
        }
    })

    const teamArr = teams.map(team => [team.name, team.inCharge ? `${team.inCharge?.firstName} ${team.inCharge?.lastName}` : "N/A", team._count.members])

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
                    <Table headers={["Name", "In Charge", "# Members"]} children={teams}/>
                </div>
            </div>
            <Outlet/>
        </div>
        
    )
}