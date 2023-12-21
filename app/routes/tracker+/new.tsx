import { parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";
import { prisma } from "#app/utils/db.server.ts";

const schema = z.object({
    so: z.string().max(20, "Customer SO# cannot have more than 20 Charater"),
    customer_details: z.string(),
    customer_contact: z.string().length(10),
    customer_address: z.string(),
    area: z.string(),
    geo_localization: z.string(),
    connection_type: z.string()
})

export async function action({ request }: ActionFunctionArgs){
    const formData = await request.formData()

    const submission = parse(formData, {schema})

    if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

    const connection = await prisma.customerConnections.create({
        data: {
            so: submission.value.so,
            customer_details: submission.value.customer_details,
            customer_address: submission.value.customer_address,
            customer_contact: submission.value.customer_contact,
            area: submission.value.area,
            geo_localization: submission.value.geo_localization,
            connection_type: submission.value.connection_type
        }
    })

    return redirect(`/tracker/${connection.id}`)
}

export default function NewConnection(){
    return (
        <div className="flex flex-col px-8">
          <h1 className="mb-5 text-3xl font-bold">Create Customer Connection</h1>
          <Form  method="POST" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <input name="so" placeholder="SO" className="block w-full p-2 border border-gray-300 rounded" />
                <input name="customer_details" placeholder="Customer Details" className="block w-full p-2 border border-gray-300 rounded" />
                <input name="customer_contact" placeholder="Contact" className="block w-full p-2 border border-gray-300 rounded" />
                <input name="customer_address" placeholder="Address" className="block w-full p-2 border border-gray-300 rounded" />
                <input name="area" placeholder="Area" className="block w-full p-2 border border-gray-300 rounded" />
                <input name="geo_localization" placeholder="Geo Localization" className="block w-full p-2 border border-gray-300 rounded" />
                <select name="connection_type" className="block w-full p-2 border border-gray-300 rounded">
                    <option value="GPON">GPON</option>
                    <option value="MPLS">MPLS</option>
                </select>
            </div>
            <div className="sm:max-w-[50%] mx-auto">
                <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-blue-700">Submit</button>
            </div>
          </Form>
        </div>
      );
}