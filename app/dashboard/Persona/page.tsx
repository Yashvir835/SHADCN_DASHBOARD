"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause, X, Edit } from "lucide-react"; // Imported Edit icon
import { useTheme } from "next-themes";
import { useBusinessContext } from "@/app/context/BusinessContext";
import AvatarCreationForm from "./_components/AvatarCreationForm";
import BackgroundAnimation from "./_components/BackgroundAnimation";
import { addAvatar, fetchAvatars, deleteAvatar, updateAvatar } from "@/lib/firebase"; // Note: updateAvatar added here
import Image from "next/image";

interface Avatar {
  avatarName: string;
  image: string;
  voice: string;
  language: string;
}

const AvatarExperiencePage: React.FC = () => {
  // State to control showing the form (for both creation and editing)
  const [showForm, setShowForm] = useState(false);
  // State to control showing the avatar list
  const [showList, setShowList] = useState(true);
  // List of avatars fetched from Firestore
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  // State to store the avatar currently being edited (if any)
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);

  const { user } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedBusiness: contextBusiness } = useBusinessContext();

  // State and ref for handling audio preview
  const [playingAvatar, setPlayingAvatar] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Show the creation form (resetting edit mode)
  const handleCreateAvatar = () => {
    setEditingAvatar(null);
    setShowForm(true);
    setShowList(false);
  };

  // Called when the form is submitted.
  // If editingAvatar is null, we add a new avatar.
  // Otherwise, we update the existing avatar.
  const handleSubmit = async (data: {
    document: any;
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

        // If creating a new avatar, call the backend endpoint then add to Firestore.
        if (!editingAvatar) {
          const response = await fetch(
            `http://127.0.0.1:5000?userId=${idPath}&document=${data.document}&avatarName=${data.avatarName}&image=${data.avatarName}&voice=${data.voice}&userEmail=${userEmail}`
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
            // Update the avatar list in state
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
        } else {
          // Update existing avatar (using updateAvatar helper)
          await updateAvatar(userId, contextBusiness, editingAvatar.avatarName, {
            avatarName: editingAvatar.avatarName, // assuming the name remains the same
            image: data.image,
            voice: data.voice,
            language: data.language,
          });
          // Update the avatar in local state
          setAvatars((prev) =>
            prev.map((av) =>
              av.avatarName === editingAvatar.avatarName
                ? { ...av, image: data.image, voice: data.voice, language: data.language }
                : av
            )
          );
          // Reset editing mode
          setEditingAvatar(null);
          // remember to show the succes message
        }
        // Hide the form and show the list again
        setShowForm(false);
        setShowList(true);
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please refresh and try again.");
      }
    }
  };

  // Delete an avatar both from Firebase and update the local state
  const handleDeleteAvatar = async (avatarName: string) => {
    if (user && contextBusiness) {
      try {
        await deleteAvatar(user.id, contextBusiness, avatarName);
        setAvatars((prev) =>
          prev.filter((avatar) => avatar.avatarName !== avatarName)
        );
      } catch (error) {
        console.error("Error deleting avatar:", error);
        alert("Error deleting avatar. Please try again.");
      }
    }
  };

  // Set the current avatar to be edited and open the form with pre-populated values.
  const handleEditAvatar = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setShowForm(true);
    setShowList(false);
  };

  // Toggle the audio preview for a given avatar
  const toggleAudioForAvatar = (avatar: { avatarName: string; voice: string }) => {
    // If the avatar is already playing, stop the audio
    if (playingAvatar === avatar.avatarName) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAvatar(null);
    } else {
      // If another audio is playing, stop it first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Create and play a new Audio instance for the selected avatar
      const newAudio = new Audio(avatar.voice);
      newAudio.play();
      audioRef.current = newAudio;
      setPlayingAvatar(avatar.avatarName);
      // When audio ends, reset the state
      newAudio.onended = () => {
        setPlayingAvatar(null);
      };
    }
  };

  return (
    <div className="relative min-h-screen p-6 space-y-8 animate-fade-in">
      {theme === "dark" && <BackgroundAnimation />}

      {/* Create / Edit Avatar Button or Form at the top */}
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
              Create Your Avatar <Plus className="ml-2" />
            </Button>
          </div>
        ) : (
          // When the form is shown, pass in the onSubmit handler.
          // You can also extend AvatarCreationForm to accept initial values (e.g. editingAvatar) if desired.
          <AvatarCreationForm onSubmit={handleSubmit} />
        )}
      </div>

      {/* Render the list of created avatars BELOW the create avatar section */}
      {avatars.length > 0 && showList && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Your Avatars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {avatars.map((avatar) => (
              <div
                key={avatar.avatarName}
                className="relative border rounded-lg p-4 flex flex-col items-center space-y-4 shadow hover:shadow-md transition-shadow"
              >
                {/* Delete Icon */}
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => handleDeleteAvatar(avatar.avatarName)}
                  aria-label="Delete Avatar"
                >
                  <X className="h-4 w-4" />
                </Button>
                {/* Edit Icon */}
                <Button
                  variant="ghost"
                  className="absolute top-5 right-2"
                  onClick={() => handleEditAvatar(avatar)}
                  aria-label="Edit Avatar"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <div className="w-full flex justify-center">
                  <Image
                    src={avatar.image}
                    alt={avatar.avatarName}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{avatar.avatarName}</h3>
                  <p className="text-sm text-gray-600">{avatar.language}</p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAudioForAvatar(avatar)}
                  >
                    {playingAvatar === avatar.avatarName ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Preview Voice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarExperiencePage;