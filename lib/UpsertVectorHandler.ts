// utils/fetchAndStoreData.ts

export const handler = async (business: string) => {
  let loading = true;
  let error: string | null = null;
  let success = false;
  console.log(`hi this is handler function which calls the upsert logic automatically with businessName : ${business}`)
  try {
    const res = await fetch('/api/pinecone/upsertVectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ business }), // Passing business as part of the request body
    });
    console.log(`the response of the upsert api is ${res.ok}`)
    if (!res.ok) {
      throw new Error('Failed to fetch or store data');
    }
    const data = await res.json();
    success = true;
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }
  console.log(error, success);
  return { loading, error, success };
};