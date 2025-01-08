// utils/fetchAndStoreData.ts

export const StoreData = async (business: string) => {
  let loading = true;
  let error: string | null = null;
  let success = false;

  try {
    const res = await fetch('/api/pinecone/upsertVectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ business }), // Passing business as part of the request body
    });

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
