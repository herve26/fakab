import { useState, useEffect, useRef, ChangeEvent, useId, useMemo } from 'react';
import { Button } from './ui/button.tsx';
import ResponsiveImage from './image-responsive.tsx';

type Props = {
  single?: boolean,
  submitting?: boolean,
  title: string,
  onSubmit: (files: File[]) => void
}

function FileSelectUpload({ single, title, submitting, onSubmit }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dropAreaRef = useRef<HTMLDivElement | null>(null);
  const id = useId()

  const allowedFileTypes = useMemo(() => ['image/jpeg', 'image/png'], []);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if(event.target.files){

      let droppedFiles = Array.from(event.target.files)
      if(single && droppedFiles.length > 1){
        const first = droppedFiles.shift()
        
        if(first){
          droppedFiles = [first]
        }
      }
      
      setFiles(Array.from(droppedFiles))
      
      Array.from(droppedFiles).map(f => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const image = e.target
          if(image && image.result && typeof image.result === "string"){
            setImages([...images, image.result])
          }
        };
        reader.readAsDataURL(f);  
      })
    }
        
  }

  useEffect(() => {
    const dropRef = dropAreaRef.current

    const handleDrop = () => (event: DragEvent) => {
      event.preventDefault();
  
      if(event.dataTransfer){
          const droppedFiles = event.dataTransfer.files;
  
          const validFiles = Array.from(droppedFiles).filter((file) =>
            allowedFileTypes.includes(file.type)
          );
          
          const invalidFiles = droppedFiles.length - validFiles.length;
  
  
          if (invalidFiles > 0) {
            setUploadError(`Invalid file type(s) detected: ${invalidFiles}`);
          } else {
            setFiles(validFiles);
          }
  
          setIsHovering(false)
      }
    }

    

    if (dropRef) {
      dropRef.addEventListener('drop', handleDrop);
      dropRef.addEventListener('dragover', (event: Event) => {
        event.preventDefault();
      });
    }

    return () => {
      if (dropRef) {
        dropRef.removeEventListener('drop', handleDrop);
        dropRef.removeEventListener('dragover', () => {});
      }
    };
  }, [allowedFileTypes]);

  return (
    <div className='flex flex-col h-full'>
      <h3 className='text-lg mb-3 uppercase'>{title}</h3>
      <div ref={dropAreaRef} className={`drop-area flex items-center justify-center ${isHovering ? "border-2 border-dashed" : "border"} rounded-lg border-primary grow mb-4`}>
        {images.length > 0 ? (
          <div className=''>
            {images.map((file, index) => (
              <ResponsiveImage key={index} src={file} alt="Preview"/> 
            ))}
          </div>
        ) : (
            <div className='text-center relative'>
                <label htmlFor={id} className="bg-primary text-white uppercase font-bold py-2 px-4 rounded shadow-md cursor-pointer">Click to select File</label>
                <input id={id} type="file" accept="image/png, image/jpeg" onChange={handleInput} className='absolute invisible'/>
            </div>
        )}
      </div>
      <Button onClick={() => onSubmit(files)} type="submit" disabled={files.length === 0 || submitting}>
        {submitting ? "Uploading..." : "Upload" }
      </Button>
      {uploadError && <p className="error">{uploadError}</p>}
    </div>
  );
}

export default FileSelectUpload;
