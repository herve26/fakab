import Table from "../table.tsx";

type Props = {
    details: {
        material: string | undefined;
        quantity: number
    }[]
}

export default function RefillOrderDetail({details}: Props){
    const detailsArr = details.map(mat => [mat.material, mat.quantity])
    return (
        <Table headers={["Material", "Quantity"]}>{detailsArr}</Table>
    )
}