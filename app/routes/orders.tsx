import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useParams } from "@remix-run/react";
import OrderCard from "#app/components/molecules/order-card.tsx";
import ScreenView from "#app/components/screen-view.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader(){
    const orders = await prisma.order.findMany({
        include: {
          supplier: {
            select: {
              supplierName: true,
              supplierType: true
            }
          },
          _count: {
            select: {
              details: true
            }
          }
        },
      });

      return json({orders})
}

function Orders() {
    const { orders } = useLoaderData<typeof loader>()
  const params = useParams()
  const location = useLocation()

  const isCol2 = location.pathname.split("/").length === 3
  
  return (
    <ScreenView heading="Orders" link="new" className="px-8 py-4">
      <div className="flex mt-4">
        <div className={`w-full grid gap-4 ${isCol2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {orders.map(order => (
              <OrderCard
                key={order.orderId}
                orderId={order.orderId}
                orderDate={order.orderDate}
                status={order.status}
                supplier={order.supplier?.supplierName}
                items={order._count.details}
                selected={params.id ? parseInt(params.id) === order.orderId : false }
              />
            ))}
          </div>
          <Outlet/>
      </div>
    </ScreenView>
  );
}

export default Orders;
