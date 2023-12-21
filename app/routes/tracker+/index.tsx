import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { prisma } from '#app/utils/db.server.ts';


export async function loader() {
  const connections = await prisma.customerConnections.findMany()
  return json({connections});
}

export default function CustomerConnections() {
  let { connections } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <div className='px-8 mb-5 flex items-center'>
        <h1 className="text-3xl font-bold text-primary">Customer Connections</h1>
        <Link to="new" className='text-3xl font-bold text-primary px-2 py-1 ml-6 border-2 border-primary'>+</Link>
      </div>
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SO</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {connections.map((item) => (
                  <tr key={item.id}>
                    <td className="px-2 py-4 whitespace-nowrap">{item.so}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{item.customer_details}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{item.customer_contact}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{item.customer_address}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{item.area}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{item.completion_date}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{item.teamId}</td>
                    <td className="px-2 py-4 whitespace-nowrap"><Link to={`${item.id}`}>E</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
