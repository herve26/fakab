import { parse } from "@conform-to/zod";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import InputLabel from "#app/components/molecules/input-label.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { Select, SelectItem } from "#app/components/ui/select.tsx";
import { prisma } from "#app/utils/db.server.ts";

const schema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    teamid: z.number().optional(),
    start_date: z.date()
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
        <InputLabel name="first_name" label="First Name" required/>
        <InputLabel name="last_name" label="Last Name" required/>
        <InputLabel type="email" name="email" label="Email" required/>
        <InputLabel type="date" name="start_date" label="Start Date"/>
        <div className="mb-4">
            <Select name="teamid" placeholder="Team">
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
