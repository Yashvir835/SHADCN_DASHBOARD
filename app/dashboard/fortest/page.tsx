'use client'; // Ensure this component runs on the client-side

import { useUser } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>; // Show a loading state while user data is being fetched
  }

  if (!isSignedIn) {
    return <div>User not signed in</div>; // Handle unauthenticated state
  }
  
  // Access the user's email address as a string
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'No email available';

  return (
    <div>
      <h1>Hi user with email {userEmail}</h1>
      <video width="100%" controls>
        <source src="/video/sample.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
