import { parse } from "@conform-to/zod";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import InputLabel from "#app/components/molecules/input-label.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { Select, SelectItem } from "#app/components/ui/select.tsx";
import { prisma } from "#app/utils/db.server.ts";

const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    teamId: z.number().optional(),
    startDate: z.date()
})

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const submission = parse(formData, {schema})
    console.log(submission)

    if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

    try {
        await prisma.employee.create({
            data: submission.value,
        });

        return redirect("/employees")
        // Handle successful creation (e.g., redirect to employee list)
    } catch (error) {
        // Handle error and return form with errors
        return null
    }
};

export async function loader() {
    const teams = await prisma.team.findMany()

    return json({teams})
}

export default function AddEmployee() {
    const { teams } = useLoaderData<typeof loader>()

  return (
    <Form method="POST" className="min-w-[36vw] rounded shadow-lg p-4">
        <InputLabel name="firstName" label="First Name" required/>
        <InputLabel name="lastName" label="Last Name" required/>
        <InputLabel type="email" name="email" label="Email" required/>
        <InputLabel type="date" name="startDate" label="Start Date"/>
        <div className="mb-4">
            <Select name="teamId" placeholder="Team">
                {teams.map(team => <SelectItem key={team.id} value={`${team.id}`}>{team.name}</SelectItem>)}
            </Select>
        </div>
        <div className="mb-4">
            <Button
                type="submit"
            >
                Create Employee
            </Button>
        </div>
    </Form>
  );
}
