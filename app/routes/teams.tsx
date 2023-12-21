import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import TeamCard from "#app/components/team-card.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader(){
    const teams = await prisma.team.findMany({
        select: {
            id: true,
            name: true,
            inCharge: {
                select: {
                    username: true,
                    name: true,
                    id: true
                }
            },
            members: {
                select: {
                    username: true,
                    name: true,
                    id: true
                }
            }
        }
    })

    return json({teams})
}

export default function TeamIndex(){
    const { teams } = useLoaderData<typeof loader>()

    return (
        <div className="flex px-8 space-x-4">
            <div className="border border-red-500 w-full">
                <div className="flex space-x-4">
                    <h1 className="text-2xl font-bold">Teams</h1>
                    <Link className="text-2xl font-bold border border-primary" to="new">+</Link>
                </div>
                <div className="py-2 align-middle inline-block min-w-full">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Charge</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Members</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Connections</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Connections</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teams.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-2 py-4 whitespace-nowrap">{item.name}</td>
                                        <td className="px-2 py-4 whitespace-nowrap">{item.inCharge?.name}</td>
                                        <td className="px-2 py-4 whitespace-nowrap">3</td>
                                        <td className="px-2 py-4 whitespace-nowrap">16</td>
                                        <td className="px-2 py-4 whitespace-nowrap">2</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Outlet/>
        </div>
        
    )
}