import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { storage } from '@/app/firebase/firebase-config'
import { fetchDocuments } from '@/lib/firebase'
import { PdfReader } from 'pdfreader'
import pc from '@/lib/pinecone-client'
import { Url } from 'url'


export async function POST(req: NextRequest) {
  try {
    console.log("Received request...")

    // **1. Authenticate user**
    const { userId } = getAuth(req)
    if (!userId) {
      console.log("No userId found in request")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // **2. Parse request body**
    const { business } = await req.json()
    if (!business) {
      console.log("No business provided")
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }
    const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, '_')

    // **3. Fetch business details from Firestore**
    const businessData = await fetchDocuments(userId, safeBusinessName, storage)
    console.log("Business data:", businessData)
    
    // here will be backend flask request to send business data to the backend and in response you have to give me json file with list of documents with array of chunks , dateAdded and documetname , document url 
    // **4. Fetch documents from backend Flask API**
    const response = await fetch('http://127.0.0.1:5000/process-documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "Business data": businessData }), // Ensure the key matches
    });

    if (!response.ok) {
      throw new Error('Failed to fetch business documents');
    }

    const jsonResponse = await response.json();
    console.log('The response is:', jsonResponse);

    // **4 Process each document to extract text from the PDFs**
    const documentsWithContent = await Promise.all(
      businessData.map(async (doc) => {
        try {
          const response = await fetch(doc.url)
          if (!response.ok) {
            throw new Error(`Failed to download document: ${doc.name}`)
          }

          // const arrayBuffer = await response.arrayBuffer()  // Use arrayBuffer instead of buffer()
           
          // Convert ArrayBuffer to Buffer
          // const buffer = Buffer.from(arrdocumentsayBuffer)
          // console.log(`the buffer is ${buffer} for the document ${doc.name}`)
          // Process the PDF data using pdfreader
          // const content = await extractTextFromPDF(buffer)
          // console.log(`the content which converted into text is ${content} for the document ${doc.name}`)
          // **Generate Embedding for Extracted Text using Pinecone**
          // const embedding = await createEmbedding(content)
          // const upsertResult = upsertEmbeddings(userId, [embedding], doc.name,doc.uploadDate,safeBusinessName,doc.url)
          // console.log("Upsert Result:", upsertResult)
          // console.log("Extracted text from", doc.name)
          // console.log("Embedding:", embedding)

          // Return document with extracted content (text)
          return {
            id: doc.id,
            name: doc.name,
            url: doc.url,
            uploadDate: doc.uploadDate,
            // content: content,  // Store extracted text in 'content'
            // embedding: content,  // Store the embedding
            }
        } catch (error) {
          console.error(`Error processing ${doc.name}:`, error)
        }
      })
    )

    // **5. Return the documents with extracted text content**
    return NextResponse.json({ success: true, documents: documentsWithContent })

  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
// Helper function to extract text from PDF using pdfreader
const extractTextFromPDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfReader = new PdfReader()
    let text = ''

    // Using the pdfreader to parse the PDF content
    pdfReader.parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err)
      } else if (!item) {
        resolve(text)  // End of file, return the extracted text
      } else if (item.text) {
        text += item.text + '\n'  // Concatenate text from PDF
      }
    })
  })
}
// Helper function to create embeddings using Pinecone's Inference API
const createEmbedding = async (text: string): Promise<number[]> => {
  try {
    // Define the model and input type
    const model = 'multilingual-e5-large';

    // Generate embeddings using Pinecone's inference API
    const embeddingsResult = await pc.inference.embed(
      model,
      [text],  // Use the concatenated text fields
      { inputType: 'passage', truncate: 'END' }
    );

    // Log the structure of the response to verify its format
    // console.log("Embeddings Result:", embeddingsResult);

    // Extract the embedding values from the response
    const embedding = embeddingsResult.data[0]?.values || [];

    if (!embedding.length) {
      throw new Error('No embedding found in the response.');
    }

    return embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw new Error('Embedding generation failed');
  }
}


// Helper function to upsert embeddings into Pinecone
const upsertEmbeddings = async (userId: string, adjustedEmbeddings: any[], documentName: string,dateAdded:string,businessName:string,documentUrl:string) => {
  try {
    // Map the embeddings to include necessary metadata
    const ID = `${userId}/${businessName}/${documentName}`;  // Create a unique ID for the document
    const data = adjustedEmbeddings.map((embedding: any) => ({
      id: ID,  // Create a unique ID (you can also use a more specific unique ID here)
      values: embedding,  // The embedding values (vector data)
      metadata: {
        name: documentName,
        business: businessName,
        dateAdded: dateAdded|| "N/A",  // Fallback for missing fields
        documentUrl: documentUrl,
      },
    }));

    // Log data structure to check before upserting
    console.log("Data to be upserted:", JSON.stringify(data, null, 2));

    // Check if data is empty
    if (data.length === 0) {
      console.log("No embeddings to upsert.");
      return NextResponse.json({ error: 'No embeddings to upsert' }, { status: 400 });
    }

    // Initialize Pinecone index
    const index = pc.index('dh', 'https://dh-y3557xk.svc.aped-4627-b74a.pinecone.io');
    // Upsert the data into Pinecone
    const upsertResponse = await index.namespace('example-namespace1').upsert(data);  // Use the correct namespace

    // Log success response from Pinecone
    console.log("Embeddings stored in Pinecone:", upsertResponse);
    return upsertResponse;
  } catch (error) {
    console.error("Error upserting embeddings into Pinecone:", error);
    throw new Error('Upsert failed');
  }
}