import { parse } from "@conform-to/zod";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Select, SelectItem } from "#app/components/ui/select.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { useState } from "react";

const schema = z.object({
    name: z.string(),
    inCharge: z.number().optional(),
    members: z.array(z.string())
})

export async function action({request}: ActionFunctionArgs){
    const formData = await request.formData()
    const submission = parse(formData, { schema })

    if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

    const team = await prisma.team.create({
        data: {
            name: submission.value.name,
            inCharge: {
                connect: {
                    employeeId: submission.value.inCharge
                }
            },
            
        }
    })

    return redirect(`/teams/${team.id}`)
}

export async function loader(){
    const usersCharge = await prisma.employee.findMany({
        where: {
            inChargeOf: null,
            teamId: null
        }
    })

    return json({usersCharge})
}

export default function TeamNew(){
    const {usersCharge} = useLoaderData<typeof loader>()
    return (
        <div className="flex flex-col min-w-[40vw]">
            <h1 className="mb-5 text-3xl font-bold">Create Team</h1>
            <Form method="POST" className="space-y-4 ">
                <input name="name" placeholder="Team Name" className="block w-full p-2 border border-gray-300 rounded" />
                <Select name="inCharge" placeholder="Team Leader">
                    {usersCharge.map(employee => (
                        <SelectItem key={employee.employeeId} value={`${employee.employeeId}`}>{`${employee.firstName} ${employee.lastName}}`}</SelectItem>
                    ))}
                </Select>
                <AddMember employees={usersCharge} />
                <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
            </Form>
        </div>
    );
}

type Employee = {
    employeeId: number
    firstName: string
    lastName: string
}

// React component which has a button to add a new Member
export function AddMember({employees}: {employees: Employee[]}){
    const [ members, setMembers ] = useState<(string | null)[]>([])
    const employeeArr = employees.filter(employee => !members.includes(`${employee.employeeId}`))
    return (
        <div>
            <button
                onClick={() => setMembers([...members, null])}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >Add Member</button>
            {members.map((member, index) => (
                <Select key={index} name={`members[${index}]`} onValueChange={(value) => setMembers([...members.slice(0, index), value, ...members.slice(index + 1)])}>
                    {employeeArr.map(employee => (
                        <SelectItem key={employee.employeeId} value={`${employee.employeeId}`}>{`${employee.firstName} ${employee.lastName}`}</SelectItem>
                    ))}
                </Select>
            ))}
        </div>
    )
}

