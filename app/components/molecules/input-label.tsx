import { useId } from "react";
import { Input } from "../ui/input.tsx";


type Props = {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    type?: HTMLInputElement["type"]
}

/**
 * A component that combines a label and an input field.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.name - The name of the input field.
 * @param {string} props.label - The label for the input field.
 * @param {boolean} [props.required] - Whether the input field is required.
 * @param {string} [props.className] - The class name for the input field.
 * @param {HTMLInputElement["type"]} [props.type="text"] - The type of the input field.
 * @returns {JSX.Element} The input label component.
 */
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