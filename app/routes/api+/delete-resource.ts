import { parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "#app/utils/db.server.ts";

const schema = z.object({
    id: z.number()
})

export async function action ({ request }: ActionFunctionArgs) {
    const formData = await request.formData()

    const parsedData = parse(formData, { schema })
    console.log(parsedData)

    if(!parsedData.value){
        return json({error: "Unable to parse Data"}, {status: 400})
    }

    try {
      await prisma.documentResource.delete({
        where: {
          id: parsedData.value.id
        },
      });
      console.log(parsedData.value.id)
      console.log("DocumentResource deleted successfully")
      return json({ message: 'DocumentResource deleted successfully' });
    } catch (error) {
      console.error(error);
      return json({ error: 'Failed to delete DocumentResource' }, { status: 500 });
    }
};