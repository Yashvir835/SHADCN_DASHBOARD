// import { NextResponse } from 'next/server';
// import { IncomingForm, Files } from 'formidable'; // Correct import
// import fs from 'fs';
// // import Tesseract from 'tesseract.js';

// // Handle POST requests
// export async function POST(req: Request) {
//   const form = new IncomingForm();  // Correct initialization of IncomingForm

//   try {
//     const { fields, files }: { fields: any; files: Files } = await new Promise((resolve, reject) => {
//       form.parse(req as any, (err, fields, files) => {
//         if (err) {
//           reject(err);
//         }
//         resolve({ fields, files });
//       });
//     });

//     const uploadedFile = files.file;

//     if (!uploadedFile || Array.isArray(uploadedFile)) {
//       return NextResponse.json({ error: 'Invalid file uploaded' }, { status: 400 });
//     }

//     const filePath = (uploadedFile as any).filepath;

//     // Perform OCR
//     try {
//       // const result = await Tesseract.recognize(filePath, 'eng');
//       return NextResponse.json({ text: result.data.text }, { status: 200 });
//     } catch (ocrError) {
//       console.error('OCR processing failed:', ocrError);
//       return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 });
//     } finally {
//       // Clean up the file after processing
//       fs.unlinkSync(filePath);
//     }
//   } catch (err) {
//     console.error('Form parsing failed:', err);
//     return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
//   }
// }
