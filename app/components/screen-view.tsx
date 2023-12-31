import { Link } from "@remix-run/react";
import { type ReactNode } from "react";
import { Icon } from "./ui/icon.tsx";

type Props = {
    heading: string;
    link: string;
    children: ReactNode
}

export default function ScreenView({heading, link, children}: Props){
    return (
        <div className="grow">
            <div className="w-full">
                <div className="flex space-x-4">
                    <h1 className="text-2xl font-bold">{heading}</h1>
                    <Link className="flex items-center justify-center bg-primary w-8 h-8 text-2xl text-white font-bold border border-primary" to={link}>
                        <Icon size="font" name="plus"/>
                    </Link>
                </div>
            </div>
            {children}
        </div>
    )
}