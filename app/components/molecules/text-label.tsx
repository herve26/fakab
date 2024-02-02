import { type ReactNode } from "react";

export default function TextLabel({label, text}: {label: string, text: ReactNode}) { 
    return (
        <div className="flex flex-col text-slate-900"> 
            <span className='text-slate-400 text-md'>{label}</span>
            {text}
        </div>
    )
}