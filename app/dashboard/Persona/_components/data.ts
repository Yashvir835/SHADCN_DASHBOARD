// Importing images
import img1 from '@/image/img1.jpg';
import img2 from '@/image/img2.jpg';
import img3 from '@/image/img3.jpg';
import img4 from '@/image/img.jpg';
import Persona from '@/image/persona.jpg';
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
  Eric: string;  // Mapping audio1 to Yashvir
  Tyler: string;   // Mapping audio2 to Numair
  Anna: string; // Mapping audio3 to Vritansh
  Susan: string;   // Keeping audio4 to Malik
};

const audioAssets: AudioAssets = {
  Eric: audio1,
  Tyler: audio2,
  Anna: audio3,
  Susan: audio4, // Keeping the audio4 unchanged
};

export { audioAssets };
export const avatarProfiles = [
  {
    id: "avatar1",
    name: "Eric",
    image: avatarImages.img1,
    voice: audioAssets.Anna,
  },
  {
    id: "avatar2",
    name: "Tyler",
    image: avatarImages.img2,
    voice: audioAssets.Eric,
  },
  {
    id: "avatar3",
    name: "Anna",
    image: avatarImages.img3,
    voice: audioAssets.Susan,
  },
  {
    id: "avatar4",
    name: "Susan",
    image: avatarImages.img4,
    voice: audioAssets.Tyler,
  },
]

export const languages = [
  "Bulgarian",
  "Chinese",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Finnish",
  "French",
  "German",
  "Greek",
  "Hindi",
  "Hungarian",
  "Indonesian",
  "Italian",
  "Japanese",
  "Korean",
  "Malay",
  "Norwegian",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Slovak",
  "Spanish",
  "Swedish",
  "Turkish",
  "Ukrainian",
  "Vietnamese",
]
// import chatBotVideo from '@/video/chatBotVideo.mp4';

// type VideoAssets = {
//   chatBotVideo: string;
//   };

//   const videoAssets: VideoAssets = {
//     chatBotVideo,
//     };
//     export { videoAssets };

// this for the heading of the persona
// Type for the images object
type PersonaAssests = {
  Persona: StaticImageData;
};
// Exporting images as an object
const PersonaImages: PersonaAssests = {
  Persona,
};
export { PersonaImages };
