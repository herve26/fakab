import { invariantResponse } from "@epic-web/invariant";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { format } from "date-fns";
import { PDFDocument, type PDFTextField, StandardFonts, type PDFFont } from "pdf-lib";
import { downloadIntoMemory } from "#app/utils/cloud-storage.server.ts";
import { prisma } from "#app/utils/db.server.ts";
import { requiredCCImages } from "./$id.tsx";


async function fillFieldWithAdaptiveFontSize(field: PDFTextField, font: PDFFont, text: string, initFontSize: number) {
    const widgets = field.acroField.getWidgets();
  
    // Get the field's bounding box from its widgets
    const bbox = widgets[0].getRectangle(); // Assuming a single widget for simplicity
    const fieldWidth = bbox.width;
  
    let fontSize = initFontSize
    while (true) {
      const width = font.widthOfTextAtSize(text, fontSize);
  
      if (width <= fieldWidth) {
        break;
      }
  
      fontSize--;
    }

    console.log(fontSize)
  
    // Set the font size and text
    field.setFontSize(fontSize);
    field.setText(text)
  }
  

export async function loader({ params }: LoaderFunctionArgs){
    const id = params.id
    invariantResponse(id, "ID is required")

    const connection = await prisma.customerConnections.findUnique({
        where: {
            id: id
        },
        include:{
            documentResources: true
        }
    })

    const templateDoc = await prisma.documentTemplate.findUnique({
        where: {
            documentCode: 'liquid_CC_ACC'
        },
        include: {
            templateDocument: true
        }
    })

    invariantResponse(connection, "Connection not found")
    invariantResponse(templateDoc, "Template Document is Required")
    invariantResponse(templateDoc.templateDocument, "Template Document Resource is Required")

    const pdfBuffer = await downloadIntoMemory({fileName: templateDoc.templateDocument.path});

    const map1Res = connection.documentResources.find(res => res.tag === "map_1")
    invariantResponse(map1Res, "Detailed Map is Required")
    const mapImage = await downloadIntoMemory({fileName: map1Res.path});


    const images = await Promise.all(connection.documentResources.filter(res => (
        requiredCCImages.map(req => req.id).includes(res.tag ?? "")
    )).map(async res => (
        {buffer: await downloadIntoMemory({fileName: res.path}), id: res.tag }
    )))

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

    // const page5 = pages[4];
    // const pageWidth = page5.getWidth();
    // const pageHeight = page5.getHeight();

    // let x = 25;
    // let y = pageHeight - 100; // Start from the bottom of the page
    // let imagesPerRow = 3;
    
    const TimeRoman = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    const form = pdfDoc.getForm()
    form.updateFieldAppearances(TimeRoman)

    for (let idx = 0; idx < images.length; idx++) {
        const imageEmb = await pdfDoc.embedJpg(images[idx].buffer);

        const page5_image = form.getTextField(`page5_image_${idx + 1}`)
        page5_image.setImage(imageEmb)
    }

    const client_name = form.getTextField('client_name')
    client_name.setText(connection.customer_details.toUpperCase())
    client_name.updateAppearances(TimeRoman)

    const completion_date = form.getTextField('completion_date')
    completion_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page2_client_name = form.getTextField("page2_client_name")
    page2_client_name.updateAppearances(TimeRoman)
    
    fillFieldWithAdaptiveFontSize(page2_client_name, TimeRoman, connection.customer_details.toUpperCase(), 8)

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
            "Content-Disposition": `attachment;filename=acceptance_report_${connection.customer_details.replace(" ", "_")}.pdf`,
            'Content-Type': 'application/pdf',
            'Content-Length': `${pdfBytes.byteLength}`
        }
    })

}
