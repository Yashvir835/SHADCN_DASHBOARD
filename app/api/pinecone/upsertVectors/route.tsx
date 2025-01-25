import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase-config';
import { getAuth } from '@clerk/nextjs/server';
import pc from '@/lib/pinecone-client';
import { CharacterTextSplitter } from "@langchain/textsplitters";
import axios from 'axios';
import pdf from 'pdf-parse';

// Define proper types for Pinecone responses
type PineconeResponse = {
  values: number[];
}

async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  const modelName = 'multilingual-e5-large';

  try {
    for (const chunk of chunks) {
      // Type assertion to handle the Pinecone response
      const response = await pc.inference.embed(
        chunk,
        modelName,
        []
      ) as unknown as PineconeResponse;

      if (!response.values) {
        throw new Error('Invalid embedding response from Pinecone');
      }

      embeddings.push(response.values);
    }
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}

export async function POST(req: NextRequest) {
  // Ensure we always send JSON responses
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    }

    const { business } = await req.json();

    if (!business || typeof business !== 'string') {
      return NextResponse.json({ error: 'Invalid business name' }, { status: 400, headers });
    }

    const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, '_');
    const businessRef = doc(db, `userDetails/${userId}/businesses`, safeBusinessName);

    const businessSnapshot = await getDoc(businessRef);
    if (!businessSnapshot.exists()) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404, headers });
    }

    const businessData = businessSnapshot.data();
    if (!businessData.documentUrl) {
      return NextResponse.json({ error: 'No document URL found' }, { status: 400, headers });
    }

    // Download and process PDF
    const pdfBuffer = await axios.get(businessData.documentUrl, {
      responseType: 'arraybuffer'
    }).then(response => Buffer.from(response.data));

    const pdfData = await pdf(pdfBuffer);

    // Split text into chunks
    const splitter = new CharacterTextSplitter({
      chunkSize: 1024,
      chunkOverlap: 128
    });

    const chunks = await splitter.splitText(pdfData.text);
    const embeddings = await generateEmbeddings(chunks);

    // Prepare vectors for Pinecone
    const vectors = embeddings.map((embedding, index) => ({
      id: `${userId}_${safeBusinessName}_${index}`,
      values: embedding,
      metadata: {
        description: businessData.description,
        name: businessData.name,
        business: businessData.business,
        dateAdded: businessData.dateAdded || new Date().toISOString(),
        documentUrl: businessData.documentUrl,
        imgUrl: businessData.imageUrl || null,
      },
    }));

    // Upsert to Pinecone
    const index = pc.index('dh', 'https://dh-y3557xk.svc.aped-4627-b74a.pinecone.io');
    await index.upsert(vectors);

    return NextResponse.json({
      success: true,
      message: 'Embeddings successfully created and stored'
    }, { status: 200, headers });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }, { status: 500, headers });
  }
}

