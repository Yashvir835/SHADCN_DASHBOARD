import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/app/firebase/firebase-config"
import { useUser } from "@clerk/nextjs"
import { avatarImages, audioAssets } from './data'
interface AvatarCreationFormProps {
  onSubmit: (data: { business: string, avatarName: string, image: string, voice: string }) => void;
}

const AvatarCreationForm: React.FC<AvatarCreationFormProps> = ({ onSubmit }) => {
  const [businesses, setBusinesses] = useState<string[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [selectedAvatarName, setSelectedAvatarName] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [audio] = useState(new Audio()); // Initialize Audio object

  // Handle the playback of the selected voice
  const playAudio = (voice: string) => {
    if (selectedVoice === voice) {
      audio.pause();  // Pause if the same voice is selected again
      audio.currentTime = 0; // Reset the audio to the beginning
    } else {
      setSelectedVoice(voice);
      audio.src = audioAssets[voice]; // Set the audio source to the selected voice
      audio.play(); // Play the selected audio
    }
  };
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (user) {
        const businessesCollection = collection(db, `userDetails/${user.id}/businesses`)
        const businessSnapshots = await getDocs(businessesCollection)
        const businessNames = businessSnapshots.docs.map(doc => doc.id)
        setBusinesses(businessNames)
      }
    }

    fetchBusinesses()
  }, [user])

  const avatarNames = ['Alex', 'Sam', 'Jordan', 'Taylor']

  const handleSubmit = () => {
    if (selectedBusiness && selectedAvatarName && selectedImage && selectedVoice) {
      setIsLoading(true)
      setError(null)
      onSubmit({
        business: selectedBusiness,
        avatarName: selectedAvatarName,
        image: selectedImage,
        voice: selectedVoice
      })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Create Your Avatar</CardTitle>
        <CardDescription>Select your avatar details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            {selectedBusiness && (
              <div className="text-sm font-medium text-muted-foreground">Selected: {selectedBusiness}</div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedBusiness || "Select Knowledge Base"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {businesses.map((business) => (
                  <DropdownMenuItem key={business} onSelect={() => setSelectedBusiness(business)}>
                    {business}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {selectedAvatarName && (
              <div className="text-sm font-medium text-muted-foreground">Selected: {selectedAvatarName}</div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedAvatarName || "Avatar Name"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {avatarNames.map((name) => (
                  <DropdownMenuItem key={name} onSelect={() => setSelectedAvatarName(name)}>
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {selectedImage && (
              <div className="text-sm font-medium text-muted-foreground">
                Selected: Avatar {selectedImage}
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedImage ? `Avatar ${selectedImage}` : "Image"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {Object.keys(avatarImages).map((key) => (
                  <DropdownMenuItem key={key} onSelect={() => setSelectedImage(key)}>
                    <Avatar>
                      <AvatarImage src={avatarImages[key as keyof typeof avatarImages].src} alt={`Avatar ${key}`} />
                      <AvatarFallback>{key}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2">Avatar {key}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {selectedVoice && (
              <div className="text-sm font-medium text-muted-foreground">
                Selected: {selectedVoice}
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedVoice || "Voice"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {Object.keys(audioAssets).map((voice) => (
                  <DropdownMenuItem key={voice} onSelect={() => playAudio(voice)}>
                    {voice}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Avatar...
              </>
            ) : (
              <>
                Experience Your Avatar <ArrowRight className="ml-2" />
              </>
            )}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default AvatarCreationForm

