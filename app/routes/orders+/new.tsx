import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import InputLabel from '#app/components/molecules/input-label.tsx';
import MaterialAdd from '#app/components/molecules/material-add.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { z } from 'zod';
import { parse } from '@conform-to/zod';
import { Select, SelectItem } from '#app/components/ui/select.tsx';

const materialSchema = z.object({
	id: z.number(),
	quantity: z.number()
})

const schema = z.object({
	orderDate: z.date(),
  status: z.enum(["PENDING", "FULFILLED", "CANCELLED"]),
  supplier: z.number(),
	material: z.array(materialSchema)
})

export async function action({request}: ActionFunctionArgs){
    const formData = await request.formData()
	const submission = parse(formData, { schema })

  console.log(submission)

    if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

    const order = await prisma.order.create({
      data: {
        orderDate: submission.value.orderDate,
        supplierId: submission.value.supplier,
        details: {
          create: submission.value.material.map((material) => ({
            materialId: material.id,
            orderQuantity: material.quantity,
          })), 
        }
      },
      select:{
        orderId: true
      }
    })

    return redirect(`/orders/${order.orderId}`)
}

export async function loader(){
    const materials = await prisma.material.findMany({
        select: {
            materialCode: true,
            materialName: true,
            materialId: true
        }
    })

    const suppliers = await prisma.supplier.findMany()

    return json({materials, suppliers})
}

const AddOrderForm = () => {
  const { materials, suppliers } = useLoaderData<typeof loader>()

  return (
    <div className="w-[46vw] mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
      {/* Back button or link (optional) */}

      <Form method="POST">
        <InputLabel type="date" label="Order Date" name="orderDate"/>
        <Select name="status">
          <SelectItem value="PENDING">PENDING</SelectItem>
          <SelectItem value="FULFILLED">FULFILLED</SelectItem>
          <SelectItem value="CANCELLED">CANCELLED</SelectItem>
        </Select>
        {/* Order Date input with calendar icon */}
        <Select name="supplier">
          {suppliers.map(sup => <SelectItem key={sup.supplierId} value={`${sup.supplierId}`}>{sup.supplierName}</SelectItem>)}
        </Select>
        <div className="mt-4">
            <MaterialAdd materials={materials}/>
        </div>
        {/* Total Cost display (optional) */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4" >
          Create Order
        </button>
      </Form>
    </div>
  );
};

export default AddOrderForm;
