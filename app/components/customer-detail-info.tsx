import { Link } from "@remix-run/react";

type Props = {
    connection: {
        id: string;
        so: string;
        customer_details: string;
        customer_contact: string;
        customer_address: string;
        area: string;
        geo_localization: string;
        connection_type: string;
        has_mdu: boolean;
        assignement_date: string;
        completion_date: string | null;
        teamId: number | null;
    }
}
export default function CustomerDetailInfo({connection}: Props){
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary flex items-center justify-between">
              <h2 className="text-white text-lg leading-6 font-bold">General Information</h2>
              <Link reloadDocument to={`pdf`} className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>PDF</Link>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">SO</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.so}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Customer Details</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.customer_details}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Contact</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.customer_contact}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.customer_address}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Area</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.area}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.completion_date}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Team ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{connection.teamId}</dd>
                    </div>
                </dl>
            </div>
          </div>
    )
}