import { Link, Outlet, UIMatch, useMatches } from "@remix-run/react";

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
        <div className="border border-red-500">
            <ol className="flex items-center space-x-2 text-sm font-medium border border-blue-500 px-8 mt-4">
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

{/*  */}