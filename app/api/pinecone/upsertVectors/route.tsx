import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase-config';
import { getAuth } from '@clerk/nextjs/server'; // Server-side auth for Clerk
import pc from '@/lib/pinecone-client';

export async function POST(req: NextRequest) {
  try {
    console.log("Received request...");

    // Get the authenticated user's data (server-side)
    const { userId } = getAuth(req);  // Extracting userId (email) using Clerk
    if (!userId) {
      console.log("No userId or email found in request");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { business } = await req.json(); // Extract the 'business' from the request body
    if (!business) {
      console.log("No business provided");
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }
    const Id = `userDetails/${userId}/businesses/${business}`
    // Fetch the business details from Firestore
    const businessRef = doc(db, Id);
    const docSnapshot = await getDoc(businessRef);
    if (!docSnapshot.exists()) {
      console.log("Business data not found in Firestore");
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const businessData = docSnapshot.data();
    console.log("Business data fetched:", businessData);

    // Ensure business data has necessary fields
    if (!businessData || !businessData.description || !businessData.name || !businessData.business) {
      console.log("Missing necessary fields in business data");
      return NextResponse.json({ error: 'Missing necessary fields in business data' }, { status: 400 });
    }

    // Convert relevant fields into text for embeddings
    const textData = [
      businessData.description,
      businessData.name,
      businessData.business,
      businessData.dateAdded || "", // Ensure dateAdded is handled even if not available
      businessData.documentUrl || "" // Handle possible undefined documentUrl
    ];

    // Generate embeddings
    const model = 'multilingual-e5-large';
    const embeddingsResult: any = await pc.inference.embed(
      model,
      textData, // Use the concatenated text fields
      { inputType: 'passage', truncate: 'END' }
    );

    // Log the embeddings result to inspect the data structure
    console.log("Embeddings result:", embeddingsResult);

    // Check if embeddings were generated correctly
    if (!embeddingsResult || embeddingsResult.length === 0) {
      console.log("No embeddings generated.");
      return NextResponse.json({ error: 'No embeddings generated' }, { status: 400 });
    }
    console.log(`The size of the embedding generated is: ${embeddingsResult[0].values.length}`);

    // Adjust embedding size to match the Pinecone index (1024)
    const adjustedEmbeddings = embeddingsResult.map((embedding: any, i: number) => {
      // Ensure the embedding has a values array that contains numeric data
      if (!Array.isArray(embedding.values) || embedding.values.length === 0) {
        console.log(`Embedding ${i} does not contain valid values.`);
        return []; // Handle invalid embedding
      }

      const embeddingLength = embedding.values.length;
      console.log(`Original embedding size: ${embeddingLength}`);

      // Adjust the embedding length to match the Pinecone expected size (1024)
      const adjusted = embedding.values.slice(0, 1024); // Slice embedding to 1024 if necessary
      console.log(`Adjusted embedding ${i} size: ${adjusted.length}`);
      return adjusted; // Ensure the values array is correctly passed
    });

    // Prepare embeddings for Pinecone (flatten the array structure)
    const data = adjustedEmbeddings.map((embedding: any) => ({
      id: Id, 
      values: embedding, // Embedding values (the vector data)
      metadata: {
        description: businessData.description,
        name: businessData.name,
        location: businessData.location,
        dateAdded: businessData.dateAdded || "N/A", // Add fallback if the field is missing
        documentUrl: businessData.documentUrl || "N/A", // Add fallback if the field is missing
      },
    }));

    // Log data structure to check before upserting
    console.log("Data to be upserted:", JSON.stringify(data, null, 2));

    // Check if data is empty
    if (data.length === 0) {
      console.log("No embeddings to upsert.");
      return NextResponse.json({ error: 'No embeddings to upsert' }, { status: 400 });
    }

    // Insert embeddings into Pinecone
    const index = pc.index('dh', 'https://dh-y3557xk.svc.aped-4627-b74a.pinecone.io');

    // Ensure you are calling the correct index and namespace
    // Assuming `data[0]` contains the vector you want to upsert
    const upsertResponse = await index.namespace('example-namespace1').upsert([data[0]]);

    // Log success response from Pinecone
    console.log("Embeddings stored in Pinecone:", upsertResponse);

    return NextResponse.json({ success: true, embeddings: data });
  } catch (error) {
    console.error("Error in handler:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
