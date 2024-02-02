import { useId } from "react";
import { Input } from "../ui/input.tsx";


type Props = {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    type?: HTMLInputElement["type"]
}

export default function InputLabel({name, label, required, className, type="text"}: Props){
    const id = useId()
    
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <Input
                className={className}
                type={type}
                id={id}
                name={name}
                required={required}
            />
        </div>
    )
}