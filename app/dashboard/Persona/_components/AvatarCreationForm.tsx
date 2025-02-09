"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Play, Pause } from "lucide-react"
import { useBusinessContext } from "@/app/context/BusinessContext"
import { useUser } from "@clerk/nextjs"
import { avatarProfiles, languages } from "./data"
import { storage } from "@/app/firebase/firebase-config"
import { ref, listAll, getMetadata, getDownloadURL } from "firebase/storage"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Interface for the form submission data
interface AvatarCreationFormProps {
  onSubmit: (data: {
    document: Document
    avatarName: string
    image: string
    voice: string
    language: string
  }) => void
}

// Interface for document data fetched from Firebase
interface Document {
  id: string
  name: string
  url: string
  uploadDate: string
}

// Main component for creating an avatar through a multi-step form.
const AvatarCreationForm: React.FC<AvatarCreationFormProps> = ({ onSubmit }) => {
  // State to track the current step in the form (0: Document, 1: Avatar & Language, 2: Review)
  const [currentStep, setCurrentStep] = useState(0)

  // State for the selected document from Firebase storage (if any)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // State for the selected avatar profile; defaults to the first avatar profile in the list
  const [selectedProfile, setSelectedProfile] = useState<(typeof avatarProfiles)[0]>(avatarProfiles[0])

  // State for the selected language; initialized to "English"
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English")

  // State to manage audio playback (true if audio is currently playing)
  const [isPlaying, setIsPlaying] = useState(false)

  // Reference to the HTMLAudioElement so we can control playback (play, pause, etc.)
  const audioRef = useRef<HTMLAudioElement>(null)

  // State indicating if the form submission (or any asynchronous action) is in progress
  const [isLoading, setIsLoading] = useState(false)

  // State to hold error messages
  const [error, setError] = useState<string | null>(null)

  // Get the currently authenticated user from Clerk
  const { user } = useUser()

  // Get the selected business context from your application context
  const { selectedBusiness: contextBusiness } = useBusinessContext()

  // State to hold the list of documents fetched from Firebase storage
  const [documents, setDocuments] = useState<Document[]>([])

  // State to track if the documents are currently being fetched
  const [fetchingDocuments, setFetchingDocuments] = useState(false)

  // State to track the search query for filtering available languages
  const [searchQuery, setSearchQuery] = useState("")

  // State to track the current index for avatar profiles pagination
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0)

  // useMemo hook to create a memoized list of languages that match the search query
  const filteredLanguages = useMemo(() => {
    // Filter languages by checking if the language (lowercased) includes the search query (lowercased)
    return languages.filter((lang) => lang.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  // useEffect hook to fetch documents from Firebase storage when either the user or business context changes.
  useEffect(() => {
    const fetchDocuments = async () => {
      // Ensure both user and business context are available before attempting to fetch documents.
      if (!user || !contextBusiness) {
        setError("Please select a business first.")
        setFetchingDocuments(false)
        return
      }

      setFetchingDocuments(true)
      try {
        const userId = user.id
        // Sanitize the business name to ensure it only contains safe characters.
        const safeBusinessName = contextBusiness.replace(/[^a-zA-Z0-9]/g, "_")
        // Create a reference to the 'documents' folder in Firebase storage.
        const folderRef = ref(storage, `${userId}/${safeBusinessName}/documents`)

        // List all the files in the folder.
        const fileList = await listAll(folderRef)

        // For each file, fetch its metadata and download URL, then create a document object.
        const documentPromises = fileList.items.map(async (item, index) => {
          const metadata = await getMetadata(item)
          const url = await getDownloadURL(item)
          return {
            id: `doc${index + 1}`,
            name: item.name,
            url: url,
            uploadDate: metadata.timeCreated ? new Date(metadata.timeCreated).toLocaleDateString() : "Unknown",
          }
        })

        // Wait for all document promises to resolve.
        const fetchedDocuments = await Promise.all(documentPromises)
        // Update state with the fetched documents.
        setDocuments(fetchedDocuments)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("Failed to fetch documents. Please try again.")
      } finally {
        // Whether successful or not, indicate that fetching is done.
        setFetchingDocuments(false)
      }
    }

    // Invoke the document fetching function.
    fetchDocuments()
  }, [user, contextBusiness])

  // useEffect hook to update the selected language when the filtered languages change.
  useEffect(() => {
    // Only update if there's no selected language or the current selection isn't available in the filtered list.
    if (!selectedLanguage || !filteredLanguages.includes(selectedLanguage)) {
      if (filteredLanguages.length > 0) {
        setSelectedLanguage(filteredLanguages[0])
      }
    }
  }, [filteredLanguages, selectedLanguage])

  // Define an array of steps for the multi-step form, with a title and description for each.
  const steps = [
    { title: "Select Document", description: "Choose your knowledge base document" },
    { title: "Choose avatar and language", description: "Select your avatar profile and preferred language" },
    { title: "Review and Submit", description: "Review your selections and create your avatar" },
  ]

  // handleSubmit: Validates that all selections are made, then calls the onSubmit function with the form data.
  const handleSubmit = () => {
    if (selectedDocument && selectedProfile && selectedLanguage) {
      setIsLoading(true)
      setError(null)
      onSubmit({
        document: selectedDocument,
        avatarName: selectedProfile.name,
        // Determine the correct image URL (handle both string and object with a src property).
        image: typeof selectedProfile.image === "string" ? selectedProfile.image : selectedProfile.image.src,
        voice: selectedProfile.voice, // Assumes voice is a URL or valid string path.
        language: selectedLanguage,
      })
    } else {
      // If any selection is missing, set an error message.
      setError("Please complete all selections before submitting.")
    }
  }

  // toggleAudio: Plays or pauses the audio preview for the selected avatar's voice.
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // Pause if the audio is currently playing.
        audioRef.current.pause()
      } else {
        // Play if the audio is currently paused.
        audioRef.current.play()
      }
      // Toggle the isPlaying state.
      setIsPlaying(!isPlaying)
    }
  }

  // handleProfileSelect: Sets the selected avatar profile and ensures any playing audio is paused.
  const handleProfileSelect = (profile: (typeof avatarProfiles)[0]) => {
    setSelectedProfile(profile)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  // nextStep: Moves the form to the next step if possible.
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // prevStep: Moves the form back to the previous step if possible.
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // nextAvatar: Cycles to the next avatar profile in the list.
  const nextAvatar = () => {
    // Update the avatar index (wrapping around using modulo arithmetic).
    setCurrentAvatarIndex((prevIndex) => (prevIndex + 1) % avatarProfiles.length)
    // Update the selected avatar profile based on the new index.
    handleProfileSelect(avatarProfiles[(currentAvatarIndex + 1) % avatarProfiles.length])
  }

  // prevAvatar: Cycles to the previous avatar profile in the list.
  const prevAvatar = () => {
    // Update the avatar index, wrapping around if needed.
    setCurrentAvatarIndex((prevIndex) => (prevIndex - 1 + avatarProfiles.length) % avatarProfiles.length)
    // Update the selected avatar profile based on the new index.
    handleProfileSelect(avatarProfiles[(currentAvatarIndex - 1 + avatarProfiles.length) % avatarProfiles.length])
  }

  // renderStepContent: Renders the UI elements based on the current step of the form.
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Step 0: Document selection.
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Left side: List of available documents */}
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-lg font-medium">Available Documents</h3>
                {fetchingDocuments ? (
                  // Display loading text while documents are being fetched.
                  <div>Loading documents...</div>
                ) : documents.length > 0 ? (
                  // Map over the fetched documents to render them as selectable buttons.
                  <ul className="space-y-2 overflow-hidden">
                    {documents.map((doc) => (
                      <Button
                        key={doc.id}
                        onClick={() => setSelectedDocument(doc)}
                        // Highlight the button if the document is selected.
                        variant={selectedDocument?.id === doc.id ? "default" : "outline"}
                        className="w-full justify-start"
                      >
                        {doc.name} (Uploaded: {doc.uploadDate})
                      </Button>
                    ))}
                  </ul>
                ) : (
                  // Inform the user if no documents were found.
                  <p>No documents found. Please upload a document to proceed.</p>
                )}
              </div>
              {/* Right side: Preview of the selected document */}
              <div className="w-full md:w-1/2">
                {selectedDocument && (
                  <div className="border p-4 rounded-md">
                    <h4 className="text-lg font-medium mb-2">Document Preview</h4>
                    {selectedDocument.name.endsWith(".docx") ? (
                      // If the document is a DOCX file, use an Office Online embed.
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                          selectedDocument.url,
                        )}`}
                        width="100%"
                        height="500px"
                        frameBorder="0"
                      >
                        This is an embedded Microsoft Office document.
                      </iframe>
                    ) : (
                      // Otherwise, simply display the document in an iframe.
                      <iframe src={selectedDocument.url} title="Document Preview" className="w-full h-96 border-0" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 1:
        // Step 1: Avatar and language selection.
        return (
          <div className="space-y-8">
            {/* Language selection UI */}
            <div className="flex flex-row self-end p-4 w-full gap-2">
              <h3 className="text-lg font-medium">Select Language</h3>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="border-zinc-700 w-64">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    {/* Input to filter the list of languages */}
                    <Input
                      type="text"
                      placeholder="Search languages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-2 border-zinc-700"
                    />
                  </div>
                  {/* List out each filtered language as a selectable item */}
                  {filteredLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Avatar profile display */}
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  {/* Display the current avatar's image */}
                  <Image
                    src={avatarProfiles[currentAvatarIndex].image || "/placeholder.svg"}
                    alt={avatarProfiles[currentAvatarIndex].name}
                    width={200}
                    height={200}
                    className="rounded-full"
                  />
                  {/* Display the current avatar's name */}
                  <h3 className="text-xl font-semibold">{avatarProfiles[currentAvatarIndex].name}</h3>
                  {/* Button to play/pause the voice preview */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAudio()
                    }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    Preview Voice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pagination for avatar profiles (next/previous controls) */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious className="cursor-pointer" onClick={prevAvatar} />
                </PaginationItem>
                <PaginationItem>
                  {/* Display current avatar index (1-indexed for users) */}
                  <PaginationLink isActive>{currentAvatarIndex + 1}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext className="cursor-pointer" onClick={nextAvatar} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )

      case 2:
        // Step 2: Review and submit. Show a summary of all selections.
        return (
          <div className="space-y-6">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Review Your Selections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Display the selected document */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Document:</span>
                    <span>{selectedDocument?.name}</span>
                  </div>
                  {/* Display the selected language */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Language:</span>
                    <span>{selectedLanguage}</span>
                  </div>
                  {/* Display the selected avatar profile and provide another voice preview option */}
                  {selectedProfile && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Avatar:</span>
                        <div className="flex items-center space-x-2">
                          <Image
                            src={selectedProfile.image || "/placeholder.svg"}
                            alt={selectedProfile.name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <span>{selectedProfile.name}</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={toggleAudio}>
                          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          Preview Voice
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Main render block of the component
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Render the header showing the current step's title and description */}
      <Heading title={steps[currentStep].title} description={steps[currentStep].description} />
      <Separator className="my-6" />

      <div className="space-y-6">
        {/* Render content based on the current step */}
        {renderStepContent()}

        {/* Audio element to play the avatar's voice; stops playing when audio ends */}
        {selectedProfile && <audio ref={audioRef} src={selectedProfile.voice} onEnded={() => setIsPlaying(false)} />}

        {/* Navigation buttons for moving between steps */}
        <div className="flex justify-between mt-6">
          {/* "Previous" button; disabled on the first step */}
          <Button onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {/* "Next" or "Submit" button, depending on the current step */}
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading || !selectedDocument || !selectedProfile || !selectedLanguage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  Submit <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 0 && !selectedDocument) ||
                (currentStep === 1 && (!selectedProfile || !selectedLanguage))
              }
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Display an error alert if there's any error */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Export the AvatarCreationForm component as default
export default AvatarCreationForm