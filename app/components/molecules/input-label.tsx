import { useId } from "react";
import { Input } from "../ui/input.tsx";

type Props = {
    name: string;
    label: string;
    required?: boolean;
    type?: "text" | "password"
}

export default function InputLabel({name, label, required, type="text"}: Props){
    const id = useId()
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <Input
                type={type}
                id={id}
                name={name}
                required={required}
            />
        </div>
    )
}