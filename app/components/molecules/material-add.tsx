import { useState } from "react"
import { Select, SelectItem } from "../ui/select.tsx"
import InputLabel from "./input-label.tsx";

type Material = {
    materialid: number | null,
    material_code: string | null,
    material_name: string | null
}

type Props = {
    materials: Material[]
}

export default function MaterialAdd({materials}: Props){
    const [used, setUsed] = useState(0)

    return(
        <div>
            <div className="flex mt-5 items-center space-x-4">
                <h3 className="text-lg font-bold">Material Used</h3>
                <button className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type="button" onClick={() => setUsed(used+1)}>+</button>
            </div>
            <div>
                {Array(used).fill(0).map((_, idx) => (
                    <div key={idx} className="flex items-center jusify-between space-x-2">
                        <span className="text-md font-bold">{idx + 1}</span>
                        <div className="mb-4 grow">
                            <label htmlFor={`material[${idx}]`} className="block text-sm font-medium">
                                Material
                            </label>
                            <Select id={`material[${idx}]`} name={`material[${idx}].id`}>
                                {materials.map(mat => <SelectItem key={mat["material_code"]} value={`${mat["materialid"]}`}>{mat["material_name"]}</SelectItem>)}
                            </Select>
                        </div>
                        <InputLabel
                            className="w-16"
                            type="number"
                            name={`material[${idx}].quantity`} 
                            label="Quantity"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}