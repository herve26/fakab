import { parse } from '@conform-to/zod';
import { type ActionFunctionArgs, json } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { format } from 'date-fns';
import { z } from 'zod';
import { Dialog, DialogContent, DialogTrigger } from '#app/components/dialog.tsx';
import InputLabel from '#app/components/molecules/input-label.tsx';
import MaterialAdd from '#app/components/molecules/material-add.tsx';
import TextLabel from '#app/components/molecules/text-label.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { prisma } from '#app/utils/db.server.ts';

const materialSchema = z.object({
	id: z.number(),
	quantity: z.number()
})
const schema = z.object({
	id: z.string(),
	completion_date: z.date(),
	material: z.array(materialSchema)
})

export async function action({request}: ActionFunctionArgs){
	const formData = await request.formData()
	const submission = parse(formData, { schema })
	
	console.log(submission)

	if(!submission.value){
        return json({status: "error", submission}, {status: 404})
    }

	try {
		await prisma.customerConnections.update({
			where: {
				id: submission.value.id
			},
			data: {
				completion_date: submission.value.completion_date,
				materialUsed: {
					create: submission.value.material.map(s => ({
						material: { connect: { materialId: s.id }},
						quantity: s.quantity
					}))
				}
			}
		})
	} catch(e){
		return json({status: "Error", submission}, {status: 500})
	}

	return null
}

export async function loader() {
  const connections = await prisma.customerConnections.findMany()
  const materials = await prisma.material.findMany({
	select:{
		materialCode: true,
		materialName: true,
		materialId: true
	}
  })
  return json({connections, materials});
}

function CustomerConnectionsList() {
  	const { connections, materials } = useLoaderData<typeof loader>();
  	const fetcher = useFetcher()

	return (
		<div className='px-8 py-6  h-full'>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{connections.map((connection) => (
					<div key={connection.id} className="border border-slate-200 bg-white rounded-lg shadow-md p-4">
						<div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-200">
							<h3 className="text-lg font-bold mb-2">{connection.so}</h3>
							{connection.has_mdu && <div className="border border-primary rounded-xl text-primary text-sm px-3 py-2">MDU</div>}
						</div>
						<div className='grid grid-cols-2 gap-2'>
							<TextLabel label="Customer" text={connection.customer_details}/>
							<TextLabel label="Area" text={connection.area}/>
							<TextLabel label="Connection Type" text={connection.connection_type}/>
							<TextLabel label="Assignment Date" text={format(new Date(connection.assignement_date), "dd-MMM-yyyy")}/>
							{connection.completion_date && (
								<TextLabel label="Completion Date" text={format(new Date(connection.completion_date), "dd-MMM-yyyy")}/>
							)}
							<TextLabel label="Geo Localisation" text={connection.geo_localization}/>
						</div>
						<div className="flex justify-between mt-4 pt-4 border-t-2 border-slate-200">
							<Dialog>
								<DialogTrigger asChild>
									<button className='bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm'>DONE</button>
								</DialogTrigger>
								<DialogContent>
									<fetcher.Form method="POST">
										<input type="hidden" name="id" value={connection.id}/>
										<InputLabel type="date" label="Completion Date" name="completion_date"/>
										<MaterialAdd materials={materials}/>
										<Button type='submit'>Add Material</Button>
									</fetcher.Form>
								</DialogContent>
							</Dialog>
							<Link to={`${connection.id}`} className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
								Details
							</Link>
							{!connection.has_mdu && <button
								className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								onClick={() => fetcher.submit("", { method: "POST", action: `/tracker/${connection.id}/mdu`})}>MDU</button>}
							<Link reloadDocument to={`${connection.id}/pdf`} className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>PDF</Link>
						</div>
					</div>
				))}
			</div>
			{connections.length === 0 && <div className='flex flex-col items-center justify-center h-full'>
				<h3 className='text-lg font-bold'>No Connection</h3>
				<Link to='new' className='bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2'>
					Add Connection
				</Link>
			</div>}
		</div>
	);
}

export default CustomerConnectionsList;
