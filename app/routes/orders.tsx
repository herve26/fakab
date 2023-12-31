import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ScreenView from "#app/components/screen-view.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader(){
    const fetchedOrders = await prisma.order.findMany({
        include: {
          details: {
            include: {
              material: {
                select: { materialName: true, materialCode: true, materialUnit: true },
              },
            },
          },
        },
      });

      return json({orders: fetchedOrders})
}

function Orders() {
    const { orders } = useLoaderData<typeof loader>()
  return (
    <ScreenView heading="Orders" link="new">
        <div className="container mx-auto p-4">
      <table className="table-auto w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Order Date</th>
            <th className="px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">{order.orderId}</td>
              <td className="px-4 py-2">{order.orderDate}</td>
              <td className="px-4 py-2">
                <ul>
                  {order.details.map((detail) => (
                    <li key={detail.orderDetailId} className="mb-2">
                      {detail.material.materialName} ({detail.material.materialCode}) x{detail.orderQuantity} {detail.material.materialUnit.unitName}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </ScreenView>
  );
}

export default Orders;
