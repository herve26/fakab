import { getSupabaseClient } from "#app/utils/supa.server.ts";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet, UIMatch, useMatches } from "@remix-run/react";

export async function loader({request}: LoaderFunctionArgs){
    const headers = new Headers()
    const supabase = getSupabaseClient(request.headers.get('Cookie') ?? '', headers)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if(error || !user){
        return redirect("/login", {headers})
    }

    return json({user: user}, { headers })
}



type BreadcrumbData = {
    route: string,
    text: string
}

interface MatchData {
    breadcrumb?: (match: unknown) => BreadcrumbData
}

export default function Admin(){
    const matches = useMatches() as UIMatch<unknown, MatchData>[];
    
    return(
        <div className="">
            <ol className="flex items-center space-x-2 text-sm font-medium px-8 mt-4">
                {matches
                .filter(
                    (match) =>
                    match.handle && match.handle.breadcrumb
                )
                .map((match, index, filteredMatches) => {
                    const breadcrumb = match.handle.breadcrumb ? match.handle.breadcrumb(match) : undefined

                    if(!breadcrumb) return undefined

                    return (
                        <li key={index}>
                            {index === filteredMatches.length - 1 ? (
                                <span className="bg-primary text-white inline-flex px-2 py-[2px]">{breadcrumb.text}</span>
                            ) : (
                                <Link to={breadcrumb.route} className="text-gray-600 hover:text-gray-700">
                                    {breadcrumb.text}
                                </Link>
                            )}
                        </li>
                    )})}
            </ol>
            <Outlet/>
        </div>
    )
    
}