import { parse } from '@conform-to/zod';
import { type ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import InputLabel from '#app/components/molecules/input-label.tsx';
import MaterialAdd from '#app/components/molecules/material-add.tsx';
import { Select, SelectItem } from '#app/components/ui/select.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { supabaseClient } from '#app/utils/supa.server.ts';

const materialSchema = z.object({
	id: z.number(),
	quantity: z.number()
})

const schema = z.object({
	order_date: z.date(),
  status: z.enum(["PENDING", "FULFILLED", "CANCELLED"]),
  supplier: z.number(),
	material: z.array(materialSchema)
})

export async function action({request}: ActionFunctionArgs){
    const formData = await request.formData()
	const submission = parse(formData, { schema })

    if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

    const { error } = await supabaseClient.rpc("create_order", {
      order_date: submission.value.order_date.toDateString(),
      supplierid: submission.value.supplier,
      status: submission.value.status,
      order_details_data: submission.value.material.map(mat => ({order_quantity: mat.quantity, materialid: mat.id}))
    })

    console.log(error)

    if(error) return null

    return redirect(`/orders`)
}

export async function loader(){
  const materials = await supabaseClient.from("material").select()
  const suppliers = await supabaseClient.from("supplier").select()

  return json({materials: materials.data ?? [], suppliers: suppliers.data ?? []})
}

const AddOrderForm = () => {
  const { materials, suppliers } = useLoaderData<typeof loader>()

  console.log(materials)

  return (
    <div className="w-[46vw] mx-auto p-4">
		<h2 className="text-2xl font-bold mb-4">Create New Order</h2>
		{/* Back button or link (optional) */}

      	<Form method="POST">
			<InputLabel type="date" label="Order Date" name="order_date"/>
			<div className='mb-4'>
				<label className="block text-sm font-medium">
					Status
				</label>
				<Select name="status">
					<SelectItem value="PENDING">PENDING</SelectItem>
					<SelectItem value="FULFILLED">FULFILLED</SelectItem>
					<SelectItem value="CANCELLED">CANCELLED</SelectItem>
				</Select>
			</div>
			<div className='mb-4'>
				<label className="block text-sm font-medium">
					Supplier
				</label>
				<Select name="supplier">
					{suppliers.map(sup => <SelectItem key={sup.supplierid} value={`${sup.supplierid}`}>{sup.supplier_name}</SelectItem>)}
				</Select>
			</div>
			<div className="mt-4">
				<MaterialAdd materials={materials}/>
			</div>
			<button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4" >
				Create Order
			</button>
      	</Form>
    </div>
  );
};

export default AddOrderForm;
