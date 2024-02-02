import { invariantResponse } from "@epic-web/invariant";
import { type LoaderFunctionArgs } from "@remix-run/node";
import JSZip from "jszip";
import { generateAcceptancePDF } from "#app/utils/generate-acceptance-pdf.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import { getUUID } from "#app/utils/uuid.server.ts";
  

export async function loader({ params }: LoaderFunctionArgs){
    const shortid = params.id
    invariantResponse(shortid, "ID is required")

    const id = getUUID(shortid)

    const { data: connection } = await supabaseClient.from("customer_connection").select().eq("id", id).single()

    invariantResponse(connection, "Connection not found")

    
    const pdfBytes = await generateAcceptancePDF({customerID: id, templateID: 'liquid_CC_ACC'})
    if(connection.has_mdu){
        const mduBytes = await generateAcceptancePDF({customerID: id, templateID: 'liquid_CC_ACC_MDU', mdu: true})

        const zip = new JSZip()

        zip.file(`${connection.customer_details.replace(" ", "_")}.pdf`, pdfBytes, { binary: true })
        zip.file(`${connection.customer_details.replace(" ", "_")}_MDU.pdf`, mduBytes, { binary: true })

        const zipData = await zip.generateAsync({type: "uint8array"})

        return new Response(zipData, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment;filename=acceptance_report_${connection.customer_details.replace(" ", "_")}.zip`,
                'Content-Type': 'application/zip',
                'Content-Length': `${zipData.byteLength}`
            }
        })
    }

    return new Response(pdfBytes, {
        status: 200,
        headers: {
            "Content-Disposition": `attachment;filename=acceptance_report_${connection.customer_details.replace(" ", "_")}.pdf`,
            'Content-Type': 'application/pdf',
            'Content-Length': `${pdfBytes.byteLength}`
        }
    })

}
