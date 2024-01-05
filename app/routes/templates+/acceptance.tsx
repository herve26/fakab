import { type ActionFunctionArgs, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { PDFDocument, type PDFField } from 'pdf-lib';
import React, { useState, useEffect } from 'react';
import { Button } from "#app/components/ui/button.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { cloudStorageUploaderHandler } from '#app/utils/uploader.server.ts';


export async function action({ request }: ActionFunctionArgs) {
    const formData = await unstable_parseMultipartFormData(request, cloudStorageUploaderHandler);
    const filename = formData.get('acceptance_report');

    if(typeof filename !== 'string') throw new Error('Invalid file type')

    await prisma.resource.create({
        data: {
            name: "As Build - Page 1",
            path: filename
        }
    })

    return null
  
};

const PDFFormFields = () => {
  const [fields, setFields] = useState<PDFField[]>([]);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  console.log(fields);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files ? event.target.files[0] : null);
  };

  useEffect(() => {
    const loadAndExtractFields = async () => {
      try {
        if (selectedFile) {
          const fileReader = new FileReader();
          fileReader.onload = async (event) => {
            if(event.target === null) return;
            
            const arrayBuffer = event.target.result;
            if(arrayBuffer === null) return;

            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const form = pdfDoc.getForm();
            const allFields = form.getFields();
            setFields(allFields);
          };
          fileReader.readAsArrayBuffer(selectedFile);
        } else {
          setFields([]);
        }
      } catch (error: any) {
        setError(error);
      }
    };

    loadAndExtractFields();
  }, [selectedFile]);

  return (
    <div className='px-8 py-6'>
        <Form method="POST" encType="multipart/form-data">
            <input name="acceptance_report" type="file" accept=".pdf" onChange={handleFileChange} />
            <Button type="submit">Submit</Button>
        </Form>
      
      {error ? (
        <div>Error loading PDF fields</div>
      ) : (
        <ul>
          {fields.map((field, index) => (
            <li key={index}>
              {field.getName()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PDFFormFields;