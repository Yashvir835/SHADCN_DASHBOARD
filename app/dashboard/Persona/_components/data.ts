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
  Yashvir: string;  // Mapping audio1 to Yashvir
  Numair: string;   // Mapping audio2 to Numair
  Vritansh: string; // Mapping audio3 to Vritansh
  Malik: string;   // Keeping audio4 to Malik
};

const audioAssets: AudioAssets = {
  Yashvir: audio1,
  Numair: audio2,
  Vritansh: audio3,
  Malik: audio4, // Keeping the audio4 unchanged
};

export { audioAssets };

// import chatBotVideo from '@/video/chatBotVideo.mp4';

// type VideoAssets = {
//   chatBotVideo: string;
//   };

//   const videoAssets: VideoAssets = {
//     chatBotVideo,
//     };
//     export { videoAssets };