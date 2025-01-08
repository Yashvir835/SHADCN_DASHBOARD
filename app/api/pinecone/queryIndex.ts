import type { NextApiRequest, NextApiResponse } from 'next';
import { Pinecone } from '@pinecone-database/pinecone';
import pc from '@/lib/pinecone-client';
import { useUser } from "@clerk/clerk-react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  const { user } = useUser();  // Get the current user (email as unique ID)

  // Pinecone index setup (use your index name and host)
  const index = pc.index("fn", "https://fn-y3557xk.svc.aped-4627-b74a.pinecone.io");
  
  // Ensure the request method is POST
  if (method === 'POST') {
    try {
      if (!user?.id) {
        return res.status(400).json({ error: 'Email not found' });  // Ensure user is authenticated and has an email
      }

      const userEmail = user.id;  // Use email as the unique identifier for the query
      const topK = Array.isArray(query.topK) ? parseInt(query.topK[0]) : parseInt(query.topK || '3');
     

      const queryText = req.body.queryText;  // Expecting queryText in the body

      if (typeof queryText === 'string') {
        const model = 'multilingual-e5-large';

        // Perform the embedding
        const embeddingsResult: any = await pc.inference.embed(
          model,
          [queryText],  // Wrap in an array for the embedding API
          { inputType: 'passage', truncate: 'END' }
        );

        const embedding = embeddingsResult[0];  // Extract the first embedding

        if (!embedding) {
          return res.status(400).json({ error: 'Failed to get embedding' });
        }

        // Query Pinecone index by email and embedding
        const queryResponse = await index.namespace('example-namespace').query({
          vector: embedding,  // Use the embedded query vector here
          topK: topK,
          filter: { "email": { "$eq": userEmail } },  // Filter by the user's email for access control
          includeValues: true,  // Set this to false if you don't need to include the vector values
          includeMetadata: true, // Set this to false if you don't need metadata
        });

        return res.status(200).json(queryResponse);
      } else {
        return res.status(400).json({ error: 'queryText should be a string' });
      }

    } catch (error) {
      console.error('Query Error:', error);
      res.status(500).json({ error: 'Error querying Pinecone index' });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
