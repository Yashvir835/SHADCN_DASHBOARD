// Importing images
import img1 from '@/image/img1.jpg';
import img2 from '@/image/img2.jpg';
import img3 from '@/image/img3.jpg';
import img4 from '@/image/img.jpg';

// Import StaticImageData for typing
import { StaticImageData } from 'next/image';

// Type for the images object
type ImageAssets = {
  img1: StaticImageData;
  img2: StaticImageData;
  img3: StaticImageData;
  img4: StaticImageData;
};

// Exporting images as an object
const avatarImages: ImageAssets = {
  img1,
  img2,
  img3,
  img4,
};

export  {avatarImages};


import audio1 from '@/audio/audio1.mp3';
import audio2 from '@/audio/audio2.mp3';
import audio3 from '@/audio/audio3.mp3';
import audio4 from '@/audio/audio4.mp3';

type AudioAssets = {
  audio1: string;
  audio2: string;
  audio3: string;
  audio4: string;
};

const audioAssets: AudioAssets = {
  audio1,
  audio2,
  audio3,
  audio4,
};

export { audioAssets };
