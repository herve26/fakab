import { supabaseClient } from "#app/utils/supa.server.ts";
import { parse } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";

const schema = z.object({
    so: z.string().max(20, "Customer SO# cannot have more than 20 Charater").optional(),
    customer_details: z.string(),
    customer_contact: z.string().min(10).max(15),
    customer_address: z.string(),
    assignment_date: z.date().optional().transform(date => date?.toISOString()),
    completion_date: z.date().optional().transform(date => date?.toISOString()),
    has_mdu: z.boolean().optional(),
    area: z.string(),
    geo_localization: z.string(),
    connection_type: z.string()
})

export async function action({ request }: ActionFunctionArgs){
    const formData = await request.formData()

    const submission = parse(formData, {schema})

    if(!submission.value){
        console.error("Unable to Parse New Customer Data", submission.error)
        return json({status: "error", submission}, {status: 404})
    }

    const { data } = await supabaseClient.from("customer_connection").insert(submission.value).select().single()

    invariantResponse(data, "Unable to Create new Connection")
    

    return redirect(`/tracker/${data.so}`)
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
                <input name="assignment_date" placeholder="Assignement Date" type="date" className="block w-full p-2 border border-gray-300 rounded"/>
                <input name="completion_date" placeholder="Completion Date" type="date" className="block w-full p-2 border border-gray-300 rounded"/>
                <select name="connection_type" className="block w-full p-2 border border-gray-300 rounded">
                    <option value="GPON">GPON</option>
                    <option value="MPLS">MPLS</option>
                </select>
                <label className="block w-full p-2 border border-gray-300 rounded space-x-3">
                    <input name="has_mdu" placeholder="Connection With MDU?" type="checkbox" className="mr-4"/>
                    Has MDU?
                </label>
            </div>
            <div className="sm:max-w-[50%] mx-auto">
                <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-blue-700">Submit</button>
            </div>
          </Form>
        </div>
      );
}