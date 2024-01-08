import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "#app/utils/db.server.ts";

export async function action({params}: ActionFunctionArgs){
    const id = params.id

    invariantResponse(id, "Id is required")

    await prisma.customerConnections.update({
        where: {
            id
        },
        data: {
            has_mdu: true
        }
    })

    return null
}