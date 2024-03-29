import { invariantResponse } from "@epic-web/invariant";
import { format } from "date-fns";
import { PDFDocument, type PDFTextField, StandardFonts, type PDFFont, PageSizes } from "pdf-lib";
import { requiredCCImages, requiredCCMDUImages } from "#app/utils/documents-tags.server.ts";
import { downloadIntoMemory } from "#app/utils/cloud-storage.server.ts";
import { supabaseClient } from "./supa.server.ts";
import fs from "node:fs/promises"


export async function generateAcceptancePDF({customerID, templateID, mdu = false}: {customerID: string, templateID: string, mdu?: boolean} ){

    const { data: templateDoc } = await supabaseClient.from("document_template").select(`
        *,
        template_resource:document_resource(*)
    `).eq("document_code", templateID).single()

    const { data: connection } = await supabaseClient.from("customer_connection").select(`
        *,
        documents:document_resource(*)
    `).eq("id", customerID).single()

    invariantResponse(connection, "Connection not found")
    invariantResponse(connection.documents.length > 0, "Connection Documents are required")
    invariantResponse(templateDoc, "Template Document is Required")
    invariantResponse(templateDoc.template_resource.length > 0, "Template Document Resource is Required")


    const pdfBuffer = process.env["NODE_ENV"] === "production" ? 
        await downloadIntoMemory({fileName: templateDoc.template_resource[0].path}):
        await fs.readFile(`${process.cwd()}/public/${templateDoc.template_resource[0].url}`);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages()

    const map1Res = connection.documents.find(res => res.tag === (mdu ? "map_1_mdu" : "map_1"))
    invariantResponse(map1Res, "Detailed Map is Required")
    const map1Image = process.env["NODE_ENV"] === "production" ? 
        await downloadIntoMemory({fileName: map1Res.path}) : 
        await fs.readFile(`${process.cwd()}/public/${map1Res.url}`);

    const imageMap1 = await pdfDoc.embedJpg(map1Image)
    // const jpgDims = imageMap1.scale(0.17)
    const mapDims = [652, 367]

  
    const page3 = pages[2]
    page3.drawImage(imageMap1, {
        x: 142,
        y: 74,
        width: mapDims[0],
        height: mapDims[1]
    })


    const map2Res = connection.documents.find(res => res.tag === (mdu ? "map_2_mdu" : "map_2"))
    invariantResponse(map2Res, "Drawn Map is Required")
    const map2Image = process.env["NODE_ENV"] === "production" ? 
        await downloadIntoMemory({fileName: map2Res.path}) :
        await fs.readFile(`${process.cwd()}/public/${map2Res.url}`)
    const imageMap2 = await pdfDoc.embedJpg(map2Image)
    // const jpgDims2 = imageMap2.scale(0.17)

    const page4 = pages[3]
    page4.drawImage(imageMap2, {
        x: 142,
        y: 74,
        width: mapDims[0],
        height: mapDims[1]
    })

    const images = await Promise.all(connection.documents.filter(res => (
        mdu ? requiredCCMDUImages.map(req => req.id).includes(res.tag ?? "") : 
        requiredCCImages.map(req => req.id).includes(res.tag ?? "") 
    )).filter(res => res.for_report).map(async res => (
        {buffer: process.env["NODE_ENV"] === "production" ? await downloadIntoMemory({fileName: res.path}) : await fs.readFile(`${process.cwd()}/public/${res.url}`), id: res.tag }
    )))
    
    const TimeRoman = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    const form = pdfDoc.getForm()
    form.updateFieldAppearances(TimeRoman)

    for (let idx = 0; idx < images.length; idx++) {
        const imageEmb = await pdfDoc.embedJpg(images[idx].buffer);

        const page5_image = form.getTextField(`page5_image_${idx + 1}`)
        page5_image.setImage(imageEmb)
    }

    const client_name = form.getTextField('client_name')
    client_name.setText(`${connection.customer_details.toUpperCase()}${mdu ? " MDU" : ""}`)
    client_name.updateAppearances(TimeRoman)

    const completion_date = form.getTextField(mdu ? "page2_date" : 'completion_date')
    completion_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page2_client_name = form.getTextField("page2_client_name")
    page2_client_name.updateAppearances(TimeRoman)
    
    fillFieldWithAdaptiveFontSize(page2_client_name, TimeRoman, `${connection.customer_details.toUpperCase()}${mdu ? " MDU" : ""}`, 8)

    const page3_drawnby = form.getTextField('page3_drawnby')
    page3_drawnby.setText("Glodys Kabanga")
    page3_drawnby.setFontSize(8)
    

    const page3_approvedby = form.getTextField('page3_approvedby')
    page3_approvedby.setText("Glodys Kabanga") 

    const page3_date = form.getTextField('page3_date')
    page3_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page5_client_name_prefix = form.getTextField('page5_client_name_prefix')
    page5_client_name_prefix.setText(`Customer Connection_${connection.customer_details}${ mdu ? " MDU" : ""}`.toUpperCase())
    page5_client_name_prefix.setFontSize(11)
    page5_client_name_prefix.updateAppearances(TimeRoman)

    const page3_client_name = form.getTextField("page3_client_name")
    page3_client_name.setText(`${connection.customer_details.toUpperCase()}${mdu ? " MDU" : ""}`)

    const page5_client_name = form.getTextField("page5_client_name")
    page5_client_name.setText(`${connection.customer_details.toUpperCase()}${mdu ? " MDU" : ""}`)

    const page5_date = form.getTextField("page5_date")
    page5_date.setText(format(new Date(connection.completion_date ?? Date.now()), "dd/MM/yyyy"))

    const page6_client_name = form.getTextField("page6_client_name")
    page6_client_name.setText(`${connection.customer_details.toUpperCase()}${mdu ? " MDU" : ""}`)

    const survey_sheet = connection.documents.find(res => res.tag === (mdu ? "survey_sheet_mdu" : "survey_sheet"))
    if(survey_sheet){
        const sheet = process.env["NODE_ENV"] === "production" ? 
            await downloadIntoMemory({fileName: survey_sheet.path}) :
            await fs.readFile(`${process.cwd()}/public/${survey_sheet.url}`)
        const last_page = pdfDoc.addPage(PageSizes.A4)
        console.log("page Size", PageSizes.A4)
        const sheet_image = await pdfDoc.embedJpg(sheet)
        const sheetDims = sheet_image.scale(0.35)
        last_page.drawImage(sheet_image,{
            x: 0,
            y: 0,
            width: sheetDims.width,
            height: sheetDims.height
        })
    }

    form.flatten()

    return await pdfDoc.save()
}

async function fillFieldWithAdaptiveFontSize(field: PDFTextField, font: PDFFont, text: string, initFontSize: number) {
    const widgets = field.acroField.getWidgets();
  
    // Get the field's bounding box from its widgets
    const bbox = widgets[0].getRectangle(); // Assuming a single widget for simplicity
    const fieldWidth = bbox.width;
  
    let fontSize = initFontSize

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const width = font.widthOfTextAtSize(text, fontSize);
  
      if (width <= fieldWidth) {
        break;
      }
  
      fontSize--;
    }
  
    // Set the font size and text
    field.setFontSize(fontSize);
    field.setText(text)
}