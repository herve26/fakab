import { invariantResponse } from "@epic-web/invariant";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { format } from "date-fns";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { downloadIntoMemory } from "#app/utils/cloud-storage.server.ts";
import { prisma } from "#app/utils/db.server.ts";

export async function loader({ params }: LoaderFunctionArgs){
    const id = params.id
    invariantResponse(id, "ID is required")

    const connection = await prisma.customerConnections.findUnique({
        where: {
            id: id
        }
    })

    invariantResponse(connection, "Connection not found")

    const pdfBuffer = await downloadIntoMemory({fileName: "acceptance_report.pdf"});
    const mapImage = await downloadIntoMemory({fileName: "nzinga_sante.jpg"});
    
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const image = await pdfDoc.embedJpg(mapImage)
    const jpgDims = image.scale(0.17)
    const pages = pdfDoc.getPages()
    const page1 = pages[2]
    page1.drawImage(image, {
        x: 142,
        y: 74,
        width: jpgDims.width,
        height: jpgDims.height
    })
    const TimeRoman = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    const form = pdfDoc.getForm()
    form.updateFieldAppearances(TimeRoman)

    const client_name = form.getTextField('client_name')
    client_name.setText(connection.customer_details.toUpperCase())
    client_name.updateAppearances(TimeRoman)

    const completion_date = form.getTextField('completion_date')
    completion_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page3_drawnby = form.getTextField('page3_drawnby')
    page3_drawnby.setText("Glodys Kabanga")
    page3_drawnby.setFontSize(8)
    

    const page3_approvedby = form.getTextField('page3_approvedby')
    page3_approvedby.setText("Glodys Kabanga") 

    const page3_date = form.getTextField('page3_date')
    page3_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page5_client_name_prefix = form.getTextField('page5_client_name_prefix')
    page5_client_name_prefix.setText(`Customer Connection_${connection.customer_details}`.toUpperCase())
    page5_client_name_prefix.setFontSize(11)
    page5_client_name_prefix.updateAppearances(TimeRoman)

    const page3_client_name = form.getTextField("page3_client_name")
    page3_client_name.setText(connection.customer_details.toUpperCase())

    const page5_client_name = form.getTextField("page5_client_name")
    page5_client_name.setText(connection.customer_details.toUpperCase())

    const page5_date = form.getTextField("page5_date")
    page5_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page6_client_name = form.getTextField("page6_client_name")
    page6_client_name.setText(connection.customer_details.toUpperCase())

    form.flatten()

    const pdfBytes = await pdfDoc.save()

    return new Response(pdfBytes, {
        status: 200,
        headers: {
            "Content-Disposition": "attachment;filename=" + `acceptance_report_${connection.customer_details.replace(" ", "_")}.pdf`,
            'Content-Type': 'application/pdf',
            'Content-Length': `${pdfBytes.byteLength}`
        }
    })

}
