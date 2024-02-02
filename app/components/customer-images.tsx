import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useId, useState } from "react";
import { Button } from "#app/components/ui/button.tsx";
import SiteImage from "./site-image.tsx";
import ResponsiveImage from "./image-responsive.tsx";
import { Tables } from "#types/supabase.ts";

export type DocumentResource = Tables<"document_resource">

type Props = {
    imagesToAdd: {id: string, label: string}[],
    uploadedImagesFile: DocumentResource[],
    mdu?: boolean,
    customerID: string,
    requiredImages: {id: string, label: string }[]
}

export default function CustomerRequiredImages({imagesToAdd, uploadedImagesFile, mdu, customerID}: Props){
  const id = useId()
  const [images, setImages] = useState<{image: string, fileIdx: number}[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [tags, setTags] = useState<(string | undefined)[]>([])
  const [canError, setCanError] = useState(false)
  const [checkeds, setCheckeds] = useState(uploadedImagesFile.map(img => img.for_report))
  const [canSave, setCanSave] = useState(false)

  const fetcher = useFetcher()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if(event.target.files){
      const droppedFiles = Array.from(event.target.files)

      setFiles(droppedFiles)
      
     droppedFiles.map((f,idx) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const image = e.target
          if(image && image.result){
            const result = image.result

            if(typeof result === "string"){
              setImages(imgs => [...imgs, {image: result, fileIdx: idx}])
              setTags(ts => [...ts, undefined])
            }
          }
        };
        reader.readAsDataURL(f);  
      })
    }
  }

  function handleSubmitAll(){
    const validate = tags.includes(undefined)

    if(validate){
      setCanError(true)
      return
    }

    const formData = new FormData()
    images.forEach((img,idx) => {
      formData.append(`names[${idx}]`, `Site Image ${idx}`)
      formData.append(`tags[${idx}]`, tags[idx]?? "")
      formData.append(`resources[${idx}]`, files[img.fileIdx])
    })

    fetcher.submit(formData, { method: "POST", encType: "multipart/form-data", action: `/api/tracker/${customerID}/images`})
  }

  function handleTag(tag: string, idx: number){
    const temp = [...tags]
    temp[idx] = tag
    setTags(temp)
  }

  function handleRemoveImage(idx: number){
    const tempImage = images[idx]
    setFiles(files.filter((_,id) => id !== tempImage.fileIdx))
    setImages(images.filter((_, id) => id !== idx))
    setTags(tags.filter((_, id) => id !== idx))
  }

  function handleSave(){
    const data = uploadedImagesFile.map((img, idx) => ({id: img.id, for_report: checkeds[idx]}))
    fetcher.submit({data: data }, { method: "POST", action: "/api/tracker/update-resources", encType: "application/json"})
    setCanSave(false)
  }

  function handleCheck(id: number){
    console.log(checkeds)
    
    if(checkeds.filter(ch => ch).length >=10 ) return

    const imgIdx = uploadedImagesFile.findIndex(img => img.id === id)

    console.log("IMAGE INDX", imgIdx)

    if(imgIdx === -1) return

    const image = uploadedImagesFile[imgIdx]

    if(!checkeds[imgIdx]){
      const inReport = uploadedImagesFile.some((img,idx) => img.tag === image.tag && checkeds[idx])

      if(inReport){
        if(checkeds.filter(ch => ch).length === 9){
          const tempCheck = [...checkeds]
          tempCheck[imgIdx] = true
          setCheckeds(tempCheck)
          setCanSave(true)
        }
      }
      else {
        const tempCheck = [...checkeds]
        tempCheck[imgIdx] = true
        setCheckeds(tempCheck)
        setCanSave(true)
      }
    }
    else{
      const tempCheck = [...checkeds]
      tempCheck[imgIdx] = false
      setCheckeds(tempCheck)
      setCanSave(true)
    }
  }

  return (
      <div className="shadow overflow-hidden sm:rounded-lg border border-primary mb-6">
          <div className="flex justify-between items-center px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-lg leading-6 font-medium text-white">Images {mdu ? "MDU" : ""}</h2>
              {uploadedImagesFile.length <= 0 && <Button variant="secondary" onClick={handleSubmitAll}>Upload All Images</Button>}
              {uploadedImagesFile.length > 0 && canSave && <Button variant="secondary" onClick={handleSave}>Save</Button>}
          </div>
          {images.length <= 0 && uploadedImagesFile.length <= 0 && <div className="border-t border-gray-200 px-4 relative flex items-center justify-center py-5 sm:px-6 min-h-[80vh]">
              <label htmlFor={id} className="bg-primary text-white uppercase font-bold py-2 px-4 rounded shadow-md cursor-pointer">Select Site Images</label>
              <input id={id} type="file" accept="image/png, image/jpeg" className="absolute invisible" multiple onChange={handleChange}/>
          </div>}
          {images.length > 0 && uploadedImagesFile.length <= 0 && <div className="grid grid-cols-3 lg:grid-cols-4 gap-6 py-5 px-4">
            {images.map((image, idx) => (
              <SiteImage
                key={idx}
                src={image.image}
                options={imagesToAdd}
                value={tags[idx]}
                handleRemove={() => handleRemoveImage(idx)}
                onChange={(tag) =>handleTag(tag, idx)}
                error={canError && tags[idx] === undefined}
              />
            ))}
          </div>}
          {uploadedImagesFile.length > 0 && <div className="grid grid-cols-3 lg:grid-cols-4 gap-6 py-5 px-4">
            {uploadedImagesFile.map((image,idx) => 
            <div key={image.id}>
              <div className="flex justify-between w-full bg-primary px-2 py-2 text-white rounded mb-3">
                <h4 className="text-xl">{imagesToAdd.find((elm) => elm.id === image.tag)?.label}</h4>
                <input type="checkbox" checked={checkeds[idx]} onChange={() => handleCheck(image.id)}/>
              </div>
              <ResponsiveImage src={image.url ?? ""} alt={image.tag ?? ""}/>
            </div>)}
          </div>}
      </div>
  )
}

// // function 

// type ImagesUploaderProps = {
//   requiredImages: {id: string, label: string}[],
//   showImages?: boolean
// }
  
// function ImagesUploader({requiredImages, showImages}: ImagesUploaderProps){
//   const [selectedRequired, setSelectedRequired] = useState<string | undefined>(undefined)
//   const [imagesUploaded, setImagesUploaded] = useState<string[]>([])
//   const imagesLeft = requiredImages.filter(image => !imagesUploaded.includes(image.id))

//   const fetcher = useFetcher()

//   const handleUpload = ({name, image, tag}: {name: string, image: File, tag: string}) => {
//       const formData = new FormData()
//       formData.append("resource", image)
//       formData.append("tag", tag)
//       formData.append("name", name)
//       fetcher.submit(formData, { method: "POST", encType: "multipart/form-data"})
//   }

//   return(
//     <div className="">
//       <div className="flex">
//         <select value={selectedRequired} onChange={(event) => setSelectedRequired(event.target.value)}>
//           {imagesLeft.map(image => (
//             <option key={image.id} value={image.id}>{image.label}</option>
//           ))}
//         </select>
//         <Button onClick={() => {
//           if(selectedRequired) {
//             setImagesUploaded([...imagesUploaded, selectedRequired])
//             setSelectedRequired(undefined)
//           }
//         }}>Select</Button>
//       </div>
//       <div className="flex">
//         {imagesUploaded.map(imageStr => (
//           <InputFile
//             name="resource" 
//             key={imageStr}
//             show={showImages}
//             handleSubmit={(image) => handleUpload({tag: imageStr, image, name: requiredImages.find(img => img.id === imageStr)?.label ?? ""})}
//           />
//         ))}
//       </div>
//     </div> 
//   )
// }
  
// type InputFileProps = {
//   name: string
//   fullSize?: boolean
//   handleSubmit?: (image: File) => void,
//   show?: boolean
// }
  
// function InputFile({name, fullSize = false, handleSubmit, show}: InputFileProps){
//   const id = useId()
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [dimension, setDimension] = useState<{width: number, height: number} | null>(null)
//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     // Update the selected images state
//     setSelectedImage(event.target.files ? event.target.files[0] : null);
//   };
//   const resizeImage:React.ReactEventHandler<HTMLImageElement> = (event) => {
//     if(dimension !== null || fullSize) return

//     const height = event.currentTarget.offsetHeight
//     const width = event.currentTarget.offsetWidth
//     const ratio = height / width

//     setDimension({width: 300, height: 300 * ratio})
//   }

//   return (
//     <div className="relative border border-primary">
//       <div className="flex border border-red-500">
//         <label htmlFor={id} className=" block text-sm font-medium text-gray-700">
//           Select Image
//           <input name={name} onChange={handleImageUpload} id={id} type="file" className="sr-only"/>
//         </label>
//         <Button onClick={() => { 
//           if(selectedImage && handleSubmit) handleSubmit(selectedImage)
//         }}>Upload Image</Button>
//       </div>
//       {(selectedImage && show ) && 
//         <div className="">
//           <img
//             onLoad={resizeImage}
//             src={URL.createObjectURL(selectedImage)}
//             alt="Uploaded"
//             className="w-full h-full object-cover"
//             style={{
//               width: dimension?.width,
//               height: dimension?.height
//             }}
//           />
//         </div>}
//     </div>
//   )
// }