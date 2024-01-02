import Table from "../table.tsx";

type Detail = {
    materialName: string;
    quantity: number;
    unitPrice: string|null; 
}

export default function MerchantOrderDetail({details}: {details: Detail[]}){
    const detailsArr = details.map(det => [det.materialName, det.quantity, det.unitPrice ?? "-", parseInt(det.unitPrice ?? "0") * det.quantity])
    return(
        <div>
            <h3 className="text-lg font-medium mt-6 mb-2">Order Items</h3>
            <Table headers={["Material", "Quantity", "Unit Price", "Total"]} children={detailsArr}/>
        </div>
        
    )
}