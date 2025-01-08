"use client"
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook to get the current user
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/firebase-config"; // Ensure your Firebase config is imported

const ViewStoredData: React.FC = () => {
  const { user } = useUser(); // Get the current user from Clerk
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    if (!user) {
      setError("You must be logged in to view stored data.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = user.id; // Use email as unique identifier
      const businessesCollection = collection(db, `userDetails/${userId}/businesses`);
      const businessSnapshots = await getDocs(businessesCollection);

      const businessData = businessSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBusinesses(businessData);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Failed to fetch businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>View Stored Data</h2>
      <button onClick={fetchBusinesses} disabled={loading}>
        {loading ? "Loading..." : "View Stored Data"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {businesses.length === 0 && !loading && <p>No businesses found.</p>}
        {businesses.map((business) => (
          <div key={business.id} style={{ marginBottom: "20px" }}>
            <h3>{business.business}</h3>
            <p><strong>Description:</strong> {business.description}</p>
            <p><strong>Date Added:</strong> {business.dateAdded}</p>
            {business.documentUrl && (
              <p>
                <strong>Document:</strong>{" "}
                <a href={business.documentUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </p>
            )}
            {business.imageUrl && (
              <p>
                <strong>Image:</strong>{" "}
                <a href={business.imageUrl} target="_blank" rel="noopener noreferrer">
                  View Image
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewStoredData;
