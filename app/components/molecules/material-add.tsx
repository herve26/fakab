import { useState } from "react"
import { Select, SelectItem } from "../ui/select.tsx"
import InputLabel from "./input-label.tsx";

export default function MaterialAdd({materials}: {materials: Record<string, number | string>[]}){
    const [used, setUsed] = useState(0)

    return(
        <div>
            <div className="flex items-center justify-between">
                <h3>Material Used</h3>
                <button type="button" onClick={() => setUsed(used+1)}>+</button>
            </div>
            <div>
                {Array(used).fill(0).map((_, idx) => (
                    <div key={idx} className="flex items-center jusify-between space-x-2">
                        <span className="text-md font-bold">{idx + 1}</span>
                        <div className="mb-4 grow">
                            <label className="block text-sm font-medium">
                                Material
                            </label>
                            <Select name={`material[${idx}].id`}>
                                {materials.map(mat => <SelectItem key={mat["materialCode"]} value={`${mat["materialId"]}`}>{mat["materialName"]}</SelectItem>)}
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