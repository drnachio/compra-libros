import { env } from '../env/client.mjs';

const getImageUrlFromFile = (file: { filename_disk: string | null }): string =>
  `https://${env.NEXT_PUBLIC_CDN_URL}/${file.filename_disk || ''}`;

export default getImageUrlFromFile;
