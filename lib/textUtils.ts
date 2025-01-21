// // Function to chunk text by headings or a specified chunk size
// export function chunkText(text: string, chunkSize: number = 1000): string[] {
//   const headingRegex = /^#{1,6}\s+.+$/gm;
//   const chunks: string[] = [];
//   let currentChunk = "";

//   text.split('\n').forEach(line => {
//     if (headingRegex.test(line) || currentChunk.length + line.length > chunkSize) {
//       if (currentChunk) {
//         chunks.push(currentChunk.trim());
//       }
//       currentChunk = line;
//     } else {
//       currentChunk += '\n' + line;
//     }
//   });

//   if (currentChunk) {
//     chunks.push(currentChunk.trim());
//   }

//   return chunks.filter(chunk => chunk.length > 0);
// }

