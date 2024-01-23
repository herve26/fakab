import { parse } from '@conform-to/zod';
import { type ActionFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { format } from 'date-fns';
import { z } from 'zod';
import TextLabel from '#app/components/molecules/text-label.tsx';
import { supabaseClient } from '#app/utils/supa.server.ts';
import { getShortID } from '#app/utils/uuid.server.ts';

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

	if(submission.value === undefined || submission.value === null){
        return json({status: "error", submission}, {status: 404})
    }

	try {
		const customerid = submission.value.id
		await supabaseClient.from("material_used").insert(submission.value.material.map(mat => ( 
				{materialid: mat.id, quantity: mat.quantity, customerid }
		)))
		await supabaseClient.from("customer_connection").update({
			completion_date: submission.value.completion_date.toISOString(),

		}).eq("id", submission.value.id)

	} catch(e){
		return json({status: "Error", submission}, {status: 500})
	}

	return null
}

export async function loader() {
	const { data } = await supabaseClient.from("customer_connection").select()

	if(!data) throw new Error("Unable to Get Value")

	return json({connections: data.map(conn => ({...conn, id: getShortID(conn.id)}))});
}

function CustomerConnectionsList() {
	const { connections } = useLoaderData<typeof loader>();

	return (
		<div className='px-2 md:px-8 py-6  h-full'>
			<div className="mb-4 flex items-center space-x-4">
				<h2 className="text-xl font-bold">Customer Connections</h2>
				<Link to="new" className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>New</Link>
			</div>
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
							<TextLabel label="Geo Localisation" text={<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(connection.geo_localization)}`}>{connection.geo_localization}</a>}/>
							<TextLabel label="Contact" text={
								<div className='inline-flex'>
									<a href={`tel:+${connection.customer_contact}`}>{connection.customer_contact}</a>
									<a href={`https://wa.me/${connection.customer_contact.replaceAll("-","")}`} className='mr-2'>WA</a>
								</div>
							}/>
						</div>
						<div className="flex justify-between mt-4 pt-4 border-t-2 border-slate-200">
							<Link to={`${connection.id}`} className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
								Details
							</Link>
							<div className='inline-flex justify-between space-x-2'>
								{connection.path && <Link className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' reloadDocument to={`${connection.so}/kml`}>KML</Link>}
								<Link reloadDocument to={`${connection.id}/pdf`} className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>PDF</Link>
							</div>
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
