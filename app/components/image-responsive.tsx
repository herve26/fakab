import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  maxWidth?: string; // Optional, for custom maximum width
  maxHeight?: string; // Optional, for custom maximum height
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, maxWidth, maxHeight }) => {
  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full max-w-[100%] max-h-[100%] shadow-md"
        style={{ maxWidth, maxHeight }}
      />
    </div>
  );
};

export default ResponsiveImage;
