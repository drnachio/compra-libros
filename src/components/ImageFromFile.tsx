import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { env } from '../env/client.mjs';

interface ImageFromFileProps {
  file: {
    filename_disk: string | null;
    width: number | null;
    height: number | null;
    title: string | null;
  };
  width?: number;
  height?: number;
}

type ImageExtendedProps = Omit<ImageProps & ImageFromFileProps, 'src' | 'alt'>

const ImageFromFile: React.FC<ImageExtendedProps> = ({
  file,
  width,
  height,
  ...props
}) => {
  const source = `https://${env.NEXT_PUBLIC_CDN_URL}/${
    file.filename_disk || ''
  }`;
  let alt = file?.title?.split('.')[0];
  alt ||= '';
  let finalWidth = file?.width || 128;
  let finalHeight = file?.height || 128;
  const aspectRatio = finalWidth / finalHeight;
  if (width) {
    finalWidth = width;
    if (!height) {
      finalHeight = finalWidth / aspectRatio;
    }
  }
  if (height) {
    finalHeight = height;
    if (!width) {
      finalWidth = finalHeight * aspectRatio;
    }
  }
  return (
    <Image
      {...props}
      src={source}
      alt={alt}
      title={alt}
      width={finalWidth}
      height={finalHeight}      
    />
  );
};

export default ImageFromFile;
