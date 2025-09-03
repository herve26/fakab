import { type ReactNode } from "react";

/**
 * A component that displays a label and a text value.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.label - The label to display.
 * @param {ReactNode} props.text - The text to display.
 * @returns {JSX.Element} The text label component.
 */
export default function TextLabel({label, text}: {label: string, text: ReactNode}) { 
    return (
        <div className="flex flex-col text-slate-900"> 
            <span className='text-slate-400 text-md'>{label}</span>
            {text}
        </div>
    )
}