"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { useBusinessContext } from "@/app/context/BusinessContext";
import AvatarCreationForm from "./_components/AvatarCreationForm";
import BackgroundAnimation from "./_components/BackgroundAnimation";
import { addAvatar, fetchAvatars } from '@/lib/firebase'; // Import your new functions

import Image from "next/image";

const AvatarExperiencePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [avatars, setAvatars] = useState<
    {
      avatarName: string;
      image: string;
      voice: string;
      language: string;
    }[]
  >([]);
  const { user } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedBusiness: contextBusiness } = useBusinessContext();

  // Fetch avatars when user or business changes
  useEffect(() => {
    const getAvatars = async () => {
      if (user && contextBusiness) {
        try {
          const fetchedAvatars = await fetchAvatars(user.id, contextBusiness);
          setAvatars(fetchedAvatars);
        } catch (err) {
          console.error("Error fetching avatars:", err);
        }
      }
    };
    getAvatars();
  }, [user, contextBusiness]);

  const handleCreateAvatar = () => {
    setShowForm(true);
  };

  const handleSubmit = async (data: {
    document: any; // Your Document type
    avatarName: string;
    image: string;
    voice: string;
    language: string;
  }) => {
    if (user && contextBusiness) {
      try {
        const userId = user.id;
        const safeBusinessName = contextBusiness.replace(/[^a-zA-Z0-9]/g, "_");
        const idPath = `userDetails/${userId}/businesses/${safeBusinessName}`;
        const userEmail =
          user.primaryEmailAddress?.emailAddress || "No email available";
        console.log(
          `Processing avatar creation: ${data.document}, audio: ${data.voice}`
        );
        // Call your API endpoint as before
        const response = await fetch(
          `/api/experience-avatar?userId=${idPath}&document=${data.document}&avatarName=${data.avatarName}&image=${data.image}&voice=${data.voice}&userEmail=${userEmail}`
        );
        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
          // Save avatar details in Firestore
          await addAvatar(userId, contextBusiness, {
            avatarName: data.avatarName,
            image: data.image,
            voice: data.voice,
            language: data.language,
          });

          setAvatars((prev) => [
            ...prev,
            {
              avatarName: data.avatarName,
              image: data.image,
              voice: data.voice,
              language: data.language,
            },
          ]);
          router.push(responseData.redirectUrl);
        } else {
          console.error("Error:", responseData.message);
          alert(
            "Something went wrong. Please refresh and try the request again."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please refresh and try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen p-6 space-y-8 animate-fade-in">
      {theme === "dark" && <BackgroundAnimation />}

      {/* If there are stored avatars, display them as cards */}
      {avatars.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Avatars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {avatars.map((avatar) => (
              <div
                key={avatar.avatarName}
                className="border rounded-lg p-4 flex flex-col items-center space-y-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="w-full flex justify-center">
                  <Image
                    src={avatar.image}
                    alt={avatar.avatarName}
                    className="rounded-full object-cover"
                    // Instead of hardcoding width/height, you can use a responsive container
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{avatar.avatarName}</h3>
                  <p className="text-sm text-gray-600">{avatar.language}</p>
                </div>
                <div>
                  {/* Optionally add a button to preview the avatar’s voice */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // For example, play the audio (you may implement a common audio preview handler)
                      const audio = new Audio(avatar.voice);
                      audio.play();
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Preview Voice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If no avatar exists or the user wants to create a new one */}
      <div className="mt-8 flex justify-center">
        {!showForm ? (
          <div className="text-center">
            <p className="text-xl mb-4">
              Ready to experience the future of customer interaction?
            </p>
            <Button
              onClick={handleCreateAvatar}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Your Avatar <ArrowRight className="ml-2" />
            </Button>
          </div>
        ) : (
          <AvatarCreationForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default AvatarExperiencePage;
