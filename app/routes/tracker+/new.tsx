import { Form } from "@remix-run/react";

export function action(){
    
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