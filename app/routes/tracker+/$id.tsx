import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Dialog, DialogContent, DialogTrigger } from "#app/components/dialog.tsx";
import Table from "#app/components/table.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader({params}: LoaderFunctionArgs) {
  const id = params.id
  invariantResponse(id, 'Must Provide a connection ID', {status: 404})
  
  const customerConnection = await prisma.customerConnections.findUnique({
    where: { id },
    include: {
      materialUsed: {
        select: {
          quantity: true,
          material: {
            select: {
              materialCode: true,
              materialName: true
            }
          }
        }
      }
    }
  })

  invariantResponse(customerConnection, 'Connection Not Found', { status: 404 })

  return json({customerConnection});
}

export default function TrackerID(){
    const { customerConnection } = useLoaderData<typeof loader>()
    const materials = customerConnection.materialUsed.map(mat => [mat.material.materialCode, mat.material.materialName, mat.quantity])
    return (
        <div className="flex flex-col space-y-4 px-6">
          <h1 className="mb-5 text-3xl font-bold">Customer Connection</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-white text-lg leading-6 font-bold">General Information</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">SO</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.so}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Customer Details</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.customer_details}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.customer_contact}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.customer_address}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Area</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.area}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.completion_date}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Team ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.teamId}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
				<div className="flex space-x-5">
					<h2 className="text-lg leading-6 font-medium text-white">Materials Used</h2>
					<Dialog>
						<DialogTrigger>+</DialogTrigger>
						<DialogContent>Add Material Used</DialogContent>
					</Dialog>
				</div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
			        <Table
                    headers={["Material Code", "Material Name", "Qty Used"]}
                    children={materials}
                />
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-lg leading-6 font-medium text-white">Images</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-3 gap-4">
                
              </div>
            </div>
          </div>
        </div>
      );
}