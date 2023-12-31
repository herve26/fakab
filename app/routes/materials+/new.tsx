import { parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import InputLabel from "#app/components/molecules/input-label.tsx";
import TextareaLabel from "#app/components/molecules/textarea-label.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { Select, SelectItem } from "#app/components/ui/select.tsx";
import { prisma } from "#app/utils/db.server.ts";

const schema = z.object({
    materialCode: z.string(),
    materialName: z.string(),
    materialDesc: z.string().optional(),
    materialUnit: z.string()
})

export async function action({request}: ActionFunctionArgs){
    const formData = await request.formData()

    const submission = parse(formData, {schema})

    if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

    try{
        await prisma.material.create({
            data: {
                materialCode: submission.value.materialCode,
                materialName: submission.value.materialName,
                materialDesc: submission.value.materialDesc,
                materialUnit: {
                    connect: {
                        unitCode: submission.value.materialUnit
                    }
                }
            }
        })

        return redirect("/materials")
    }
    catch(e){
        return json({status: "error"}, {status: 422})
    }

}

export async function loader(){
    const units = await prisma.materialUnit.findMany()
    return json({units})
}

export default function MaterialsNew(){
    const { units } = useLoaderData<typeof loader>()

    return (
        <div className="min-w-[36vw] rounded shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Create a new material</h2>
            <Form method="POST">
                <InputLabel name="materialCode" label="Material Code" required/>
                <InputLabel name="materialName" label="Material Name" required/>
                <TextareaLabel name="materialDesc" label="Material Description"/>
                <div className="mb-4">
                    <Select name="materialUnit" placeholder="Material Unit">
                        {units.map(unit => <SelectItem key={unit.unitCode} value={unit.unitCode}>{unit.unitName}</SelectItem>)}
                    </Select>
                </div>
                <div className="mb-4">
                    <Button
                        type="submit"
                    >
                        Create material
                    </Button>
                </div>
            </Form>
        </div>
      );
}