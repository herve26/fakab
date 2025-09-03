import { Outlet } from "@remix-run/react";

/**
 * The handle for the tracker route, which defines the breadcrumb.
 */
export const handle = {
	breadcrumb: () => ({route: "/admin/tracker", text: "Tracker"}),
};

/**
 * The component for the tracker route.
 * It renders the nested routes.
 *
 * @returns {JSX.Element} The tracker component.
 */
export default function Trakcer(){
    return (
        <Outlet/>
    )
}