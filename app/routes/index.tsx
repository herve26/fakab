import { Link } from "@remix-run/react"
import { type ReactNode } from "react";
import { Icon } from "#app/components/ui/icon.tsx";
import { type IconName } from '@/icon-name'


type CardProps = {
    to: string;
    children: ReactNode;
    icon?: IconName;
}

export function Card({to, children, icon}: CardProps){
    return(
        <Link to={to} className="bg-white rounded-md border hover:shadow-md text-2xl flex items-center justify-center py-12">
            <div className="flex gap-x-2">
                {icon && <Icon size="font" name={icon}/>}
                {children}
            </div>
        </Link>
    )
}

export default function IndexRoute(){
    return(
        <div className="px-8 py-6 grid grid-cols-4 gap-x-4 gap-y-4">
            <Card to="tracker">Tracker</Card>
            <Card to="teams">Teams</Card>
            <Card to="users">Users</Card>
            <Card to="materials" icon="construction">Materials</Card>
            <Card to="orders">Orders</Card>
            <Card to="employees">Employees</Card>
            <Card to="suppliers">Suppliers</Card>
            <Card to="templates">Templates</Card>
        </div>
    )
}