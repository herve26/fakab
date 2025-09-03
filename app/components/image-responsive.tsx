import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  maxWidth?: string; // Optional, for custom maximum width
  maxHeight?: string; // Optional, for custom maximum height
}

/**
 * A responsive image component that adjusts to its container.
 *
 * @param {ResponsiveImageProps} props - The props for the component.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alt text for the image.
 * @param {string} [props.maxWidth] - The maximum width of the image.
 * @param {string} [props.maxHeight] - The maximum height of the image.
 * @returns {JSX.Element} The responsive image component.
 */
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
