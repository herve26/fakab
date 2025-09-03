import { useId } from "react"
import { Textarea } from "../ui/textarea.tsx";

type Props = {
    name: string;
    label: string;
    required?: boolean;
}

/**
 * A component that combines a label and a textarea.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.name - The name of the textarea.
 * @param {string} props.label - The label for the textarea.
 * @param {boolean} [props.required] - Whether the textarea is required.
 * @returns {JSX.Element} The textarea label component.
 */
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