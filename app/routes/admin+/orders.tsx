import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useParams } from "@remix-run/react";
import OrderCard from "#app/components/molecules/order-card.tsx";
import ScreenView from "#app/components/screen-view.tsx";
import { supabaseClient } from "#app/utils/supa.server.ts";

export async function loader(){
  const orders = await supabaseClient.from("order_summary").select()

  return json({orders: orders.data ?? []})
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
                key={order.orderid}
                orderId={order.orderid}
                orderDate={order.order_date}
                status={order.status}
                supplier={order.supplier_name}
                items={order.order_details_count}
                selected={params.id ? parseInt(params.id) === order.orderid : false }
              />
            ))}
          </div>
          <Outlet/>
      </div>
    </ScreenView>
  );
}

export default Orders;
