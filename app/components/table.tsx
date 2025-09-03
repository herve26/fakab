import { type ReactNode } from "react"

/**
 * A table header cell component.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.children - The content of the table header cell.
 * @returns {JSX.Element} The table header cell component.
 */
function TH({children}: {children: string}){
    return (
        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
    )
}

/**
 * A table data cell component.
 *
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The content of the table data cell.
 * @returns {JSX.Element} The table data cell component.
 */
function TD({children}: {children: ReactNode}){
    return(
        <td className="px-2 py-4 whitespace-nowrap">{children}</td>   
    )
}

type Props = {
    headers: string[],
    children: (string | number | undefined | null)[][] | null
}

/**
 * A table component.
 *
 * @param {Props} props - The props for the component.
 * @param {string[]} props.headers - The headers for the table.
 * @param {((string | number | undefined | null)[][] | null)} props.children - The data for the table body.
 * @returns {JSX.Element} The table component.
 */
export default function Table({headers, children}: Props){
    return (
        <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow-sm overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>{headers.map(header => <TH key={header}>{header}</TH>)}</tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {children && children.map((item, index) => (
                            <tr key={index}>
                                {item.map((td, k) => <TD key={`${index}-${k}`}>{td}</TD>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}