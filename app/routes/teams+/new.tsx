import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Select, SelectItem } from "#app/components/ui/select.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function action(){

}

export async function loader(){
    const usersCharge = await prisma.user.findMany({
        where: {
            inChargeOf: null,
            teamId: null
        }
    })

    return json({usersCharge})
}

export default function TeamNew(){
    const { usersCharge }  = useLoaderData<typeof loader>()
    
    return (
        <div className="flex flex-col min-w-[40vw]">
            <h1 className="mb-5 text-3xl font-bold">Create Team</h1>
            <Form method="POST" className="space-y-4 ">
                <input name="name" placeholder="Team Name" className="block w-full p-2 border border-gray-300 rounded" />
                <Select name="inCharge" placeholder="Team Leader">
                    <SelectItem value="HERVE">HERVE</SelectItem>
                    <SelectItem value="GLODYS">GLODYS</SelectItem>
                </Select>
                <input name="members" placeholder="Members" className="block w-full p-2 border border-gray-300 rounded" />
                <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
            </Form>
        </div>
    );
}

