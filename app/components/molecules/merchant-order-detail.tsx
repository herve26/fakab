import Table from "../table.tsx";

export default function MerchantOrderDetail({details}){
    return(
        <div>
            <h3 className="text-lg font-medium mt-6 mb-2">Order Items</h3>
            <Table headers={["Material", "Quantity", "Unit Price", "Total"]} children={details}/>
            <table className="table-auto w-full">
            <thead>
                <tr>
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
                </tr>
            </thead>
            <tbody>
                {order.details.map((detail) => (
                <tr key={detail.orderDetailId}>
                    <td className="px-4 py-2">
                        {detail.material.materialName}
                    </td>
                    <td className="px-4 py-2">{detail.orderQuantity}</td>
                    <td className="px-4 py-2">{detail.unitPrice ? detail.unitPrice.toFixed(2) : '-'}</td>
                    <td className="px-4 py-2">{(detail.unitPrice ?? 0) * detail.orderQuantity}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
    )
}