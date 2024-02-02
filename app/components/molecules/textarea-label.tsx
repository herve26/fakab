import { useId } from "react"
import { Textarea } from "../ui/textarea.tsx";

type Props = {
    name: string;
    label: string;
    required?: boolean;
}

export default function TextareaLabel({name, label, required}: Props){
    const id = useId()

    return ( 
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <Textarea
                id={id}
                name={name}
                required={required}
            />
        </div>
    )
}