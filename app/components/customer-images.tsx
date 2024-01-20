import { useFetcher } from "@remix-run/react";
import { useId, useState } from "react";
import { Button } from "#app/components/ui/button.tsx";


type Props = {
    imagesToAdd: {id: string, label: string}[],
    uploadedImagesFile: {
        id: number;
        name: string;
        content_type: string | null;
        size: number | null;
        tag: string | null;
        url: string | null;
        path: string;
        created_at: string;
        updated_at: string | null;
        customerid: string | null;
        document_templateid: number | null;
    }[],
    mdu?: boolean
}

export default function CustomerRequiredImages({imagesToAdd, uploadedImagesFile, mdu}: Props){
    return (
        <div className="shadow overflow-hidden sm:rounded-lg border border-primary mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary">
                <h2 className="text-lg leading-6 font-medium text-white">Images {mdu ? "MDU" : ""}</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <ImagesUploader
                    requiredImages={imagesToAdd}
                    showImages={false}
                />
            <div
                className="grid grid-cols-4 gap-x-2"
            >{uploadedImagesFile.map(image => 
                <div key={image.id} className="border rounded-md bg-white p-3">
                    <h4>Image of {image.tag}</h4>
                    <img key={image.id} src={image.url ?? ""} alt={image.name}/>
                </div>
                )}
              </div>
            </div>
        </div>
    )
}

type ImagesUploaderProps = {
    requiredImages: {id: string, label: string}[],
    showImages?: boolean
  }
  
  function ImagesUploader({requiredImages, showImages}: ImagesUploaderProps){
    const [selectedRequired, setSelectedRequired] = useState<string | undefined>(undefined)
    const [imagesUploaded, setImagesUploaded] = useState<string[]>([])
    const imagesLeft = requiredImages.filter(image => !imagesUploaded.includes(image.id))
  
    const fetcher = useFetcher()
  
    const handleUpload = ({name, image, tag}: {name: string, image: File, tag: string}) => {
        const formData = new FormData()
        formData.append("resource", image)
        formData.append("tag", tag)
        formData.append("name", name)
        fetcher.submit(formData, { method: "POST", encType: "multipart/form-data"})
    }
  
    return(
      <div className="">
        <div className="flex">
          <select value={selectedRequired} onChange={(event) => setSelectedRequired(event.target.value)}>
            {imagesLeft.map(image => (
              <option key={image.id} value={image.id}>{image.label}</option>
            ))}
          </select>
          <Button onClick={() => {
            if(selectedRequired) {
              setImagesUploaded([...imagesUploaded, selectedRequired])
              setSelectedRequired(undefined)
            }
          }}>Select</Button>
        </div>
        <div className="flex">
          {imagesUploaded.map(imageStr => (
            <InputFile
              name="resource" 
              key={imageStr}
              show={showImages}
              handleSubmit={(image) => handleUpload({tag: imageStr, image, name: requiredImages.find(img => img.id === imageStr)?.label ?? ""})}
            />
          ))}
        </div>
      </div> 
    )
  }
  
  type InputFileProps = {
    name: string
    fullSize?: boolean
    handleSubmit?: (image: File) => void,
    show?: boolean
  }
  
  function InputFile({name, fullSize = false, handleSubmit, show}: InputFileProps){
    const id = useId()
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [dimension, setDimension] = useState<{width: number, height: number} | null>(null)
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Update the selected images state
      setSelectedImage(event.target.files ? event.target.files[0] : null);
    };
    const resizeImage:React.ReactEventHandler<HTMLImageElement> = (event) => {
      if(dimension !== null || fullSize) return
  
      const height = event.currentTarget.offsetHeight
      const width = event.currentTarget.offsetWidth
      const ratio = height / width
  
      setDimension({width: 300, height: 300 * ratio})
    }
  
    return (
      <div className="relative border border-primary">
        <div className="flex">
          <label htmlFor={id} className=" block text-sm font-medium text-gray-700">
            Select Image
            <input name={name} onChange={handleImageUpload} id={id} type="file" className="sr-only"/>
          </label>
          <Button onClick={() => { 
            if(selectedImage && handleSubmit) handleSubmit(selectedImage)
          }}>Upload Image</Button>
        </div>
        {(selectedImage && show ) && 
          <div className="">
            <img
              onLoad={resizeImage}
              src={URL.createObjectURL(selectedImage)}
              alt="Uploaded"
              className="w-full h-full object-cover"
              style={{
                width: dimension?.width,
                height: dimension?.height
              }}
            />
          </div>}
      </div>
    )
  }