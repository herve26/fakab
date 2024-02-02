import { supabaseClient } from '#app/utils/supa.server.ts';
import { parse } from '@conform-to/zod';
import { type ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { z } from 'zod';

const schema = z.object({
  document_name: z.string(),
  document_desc: z.string().optional(),
  document_code: z.string()
})

export async function action({ request }: ActionFunctionArgs) {
  
  const parsedData = parse(await request.formData(), { schema });

  if(!parsedData.value){
    return json({status: "error", parsedData}, {status: 404})
  }

  console.log(parsedData)

  try {
    const {error} = await supabaseClient.from("document_template").insert(parsedData.value)
    console.error(error)
    return redirect("/admin/templates")
  
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.issues }, { status: 422 }); // Unprocessable Entity
    } else {
      console.error('Error creating document template:', error);
      return json({ error: 'Failed to create document template' }, { status: 500 });
    }
  }
}



export default function CreateDocumentTemplateForm() {
    return (
      <div className='p-4  w-[36vw] bg-white shadow-sm rounded-lg'>
        <h2 className="font-bold text-lg w-full text-center text-primary mb-4">New Document Template</h2>
        <Form method="POST" className="space-y-4" encType="multipart/form-data">
          <div className="mb-4 space-y-1">
            <label htmlFor="document_name" className="block text-sm font-medium text-gray-700">
              Document Name
            </label>
            <input
              type="text"
              id="document_name"
              name="document_name"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4 space-y-1">
            <label htmlFor="document_desc" className="block text-sm font-medium text-gray-700">
              Document Description
            </label>
            <textarea
              id="document_desc"
              name="document_desc"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4 space-y-1">
            <label htmlFor="document_code" className="block text-sm font-medium text-gray-700">
              Document Code
            </label>
            <input
              type="text"
              id="document_code"
              name="document_code"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create
            </button>
          </div>
        </Form>
      </div>
      
    );
}
   