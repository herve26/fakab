import { Link } from "@remix-run/react";
import { type ReactNode } from "react";
import { cn } from "#app/utils/misc.tsx";

type Props = {
    heading: string;
    link: string;
    children: ReactNode,
    className?: string
}

/**
 * A component that provides a standard screen layout with a heading and a link.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.heading - The heading to display on the screen.
 * @param {string} props.link - The URL for the link.
 * @param {ReactNode} props.children - The content of the screen.
 * @param {string} [props.className] - The class name for the screen container.
 * @returns {JSX.Element} The screen view component.
 */
export default function ScreenView({heading, link, children, className}: Props){
    return (
        <div className={cn("grow", className)}>
            <div className="w-full">
                <div className="flex space-x-4">
                    <h1 className="text-2xl font-bold">{heading}</h1>
                    <Link className="flex items-center justify-center bg-primary w-8 h-8 text-2xl text-white font-bold border border-primary" to={link}>
                        +
                    </Link>
                </div>
            </div>
            {children}
        </div>
    )
}