import Table from "../table.tsx";

type Props = {
    details: {
        material: string | undefined;
        quantity: number
    }[]
}

/**
 * A component that displays the details of a refill order.
 *
 * @param {Props} props - The props for the component.
 * @param {object[]} props.details - The details of the refill order.
 * @param {string | undefined} props.details.material - The name of the material.
 * @param {number} props.details.quantity - The quantity of the material.
 * @returns {JSX.Element} The refill order detail component.
 */
export default function RefillOrderDetail({details}: Props){
    const detailsArr = details.map(mat => [mat.material, mat.quantity])
    return (
        <Table headers={["Material", "Quantity"]}>{detailsArr}</Table>
    )
}