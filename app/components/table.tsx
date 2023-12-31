import { type ReactNode } from "react"

function TH({children}: {children: string}){
    return (
        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
    )
}

function TD({children}: {children: ReactNode}){
    return(
        <td className="px-2 py-4 whitespace-nowrap">{children}</td>   
    )
}

type Props = {
    headers: string[],
    children: Array<string | number>[]
}

export default function Table({headers, children}: Props){
    return (
        <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow-sm overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>{headers.map(header => <TH key={header}>{header}</TH>)}</tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {children.map((item, index) => (
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