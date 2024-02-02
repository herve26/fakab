import { parse } from "@conform-to/zod";
import { Form } from "@remix-run/react";
import { type ActionFunctionArgs, redirect } from "@remix-run/server-runtime";
import { z } from "zod";
import { supabaseClient } from "#app/utils/supa.server.ts";

// Define a zod schema for the supplier data
const supplierSchema = z.object({
  supplier_name: z.string().min(1),
  contact_person: z.string().optional(),
  phonenumber: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  supplier_type: z.enum(["MERCHANT", "REFILL"]).default("MERCHANT"),
});

export async function action({request}: ActionFunctionArgs){
    const submission = parse(await request.formData(), { schema: supplierSchema})
    if(!submission.value) return null

    try{
        await supabaseClient.from("supplier").insert(submission.value)
        return redirect("/suppliers")
    }
    catch(e){
        return null
    }
}

// Define a custom component called AddSupplier
function AddSupplier() {
  // Return the JSX code for rendering the component
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 shadow-lg ">
      <h1 className="text-3xl font-bold text-center mb-4">Add a New Supplier</h1>
      <Form method="POST" className="space-y-4">
        <div className="form-group flex flex-col">
          <label htmlFor="supplier-name" className="text-sm font-medium text-gray-700">Supplier Name</label>
          <input type="text" id="supplier-name" name="supplier_name" required className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="contact-person" className="text-sm font-medium text-gray-700">Contact Person</label>
          <input type="text" id="contact-person" name="contact_person" className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="phone-number" className="text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" id="phone-number" name="phonenumber" className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
          <input type="text" id="address" name="address" className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="supplier-type" className="text-sm font-medium text-gray-700">Supplier Type</label>
          <select id="supplier-type" name="supplier_type" className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="MERCHANT">Merchant</option>
            <option value="REFILL">Refill</option>
          </select>
        </div>
        <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Supplier</button>
      </Form>
    </div>
  );
}

// Export the component
export default AddSupplier;
