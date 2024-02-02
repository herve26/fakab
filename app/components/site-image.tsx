import { ChangeEvent } from "react";
import ResponsiveImage from "./image-responsive.tsx";
import { cn } from "#app/utils/misc.tsx";

type Props = {
    src: string,
    options: {id: string, label: string}[],
    className?: string,
    value: string | undefined
    onChange: (value: string) => void,
    handleRemove: () => void,
    error?: boolean
}

export default function SiteImage({src, options, className, onChange, value, error=false, handleRemove}: Props){
    function handleChange(event: ChangeEvent<HTMLSelectElement>){
        onChange(event.target.value)
    }
    
    return(
        <div className={cn(className)}>
            <div className="flex items-center mb-3">
                <select className={`grow border ${error ? "border-red-600" : "border-primary"} px-1 py-2 rounded`} value={value} onChange={handleChange}>
                    <option value="">Select A Tag</option>
                    {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
            </div>
            <div className="relative">
                <button onClick={handleRemove} className="absolute right-4 top-4 h-6 w-6 hover:text-white hover:bg-red-500 rounded">X</button>
                <ResponsiveImage src={src} alt="Site Image"/>
            </div>
        </div>
    )
}