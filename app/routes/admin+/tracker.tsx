import { Outlet } from "@remix-run/react";

export const handle = {
	breadcrumb: () => ({route: "/admin/tracker", text: "Tracker"}),
};

export default function Trakcer(){
    return (
        <Outlet/>
    )
}