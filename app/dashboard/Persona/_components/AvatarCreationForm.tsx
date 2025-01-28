"use client"

import { useState, useEffect, useRef } from "react"
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

interface AvatarCreationFormProps {
  onSubmit: (data: {
    document: Document
    avatarName: string
    image: string
    voice: string
    language: string
  }) => void
}

interface Document {
  id: string
  name: string
  url: string
  uploadDate: string
}

const AvatarCreationForm: React.FC<AvatarCreationFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<(typeof avatarProfiles)[0] | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English")
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const { selectedBusiness: contextBusiness } = useBusinessContext()
  const [documents, setDocuments] = useState<Document[]>([])
  const [fetchingDocuments, setFetchingDocuments] = useState(false)

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user || !contextBusiness) {
        setError("Please select a business first.")
        setFetchingDocuments(false)
        return
      }

      setFetchingDocuments(true)
      try {
        const userId = user.id
        const safeBusinessName = contextBusiness.replace(/[^a-zA-Z0-9]/g, "_")
        const folderRef = ref(storage, `${userId}/${safeBusinessName}/documents`)

        const fileList = await listAll(folderRef)
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

        const fetchedDocuments = await Promise.all(documentPromises)
        setDocuments(fetchedDocuments)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("Failed to fetch documents. Please try again.")
      } finally {
        setFetchingDocuments(false)
      }
    }

    fetchDocuments()
  }, [user, contextBusiness])

  const steps = [
    { title: "Select Document", description: "Choose your knowledge base document" },
    { title: "Choose Avatar and Language", description: "Select your avatar profile and preferred language" },
    { title: "Review and Submit", description: "Review your selections and create your avatar" },
  ]

  const handleSubmit = () => {
    if (selectedDocument && selectedProfile && selectedLanguage) {
      setIsLoading(true)
      setError(null)
      onSubmit({
        document: selectedDocument,
        avatarName: selectedProfile.name,
        image: selectedProfile.id,
        voice: selectedProfile.voice,
        language: selectedLanguage,
      })
    } else {
      setError("Please complete all selections before submitting.")
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProfileSelect = (profile: (typeof avatarProfiles)[0]) => {
    setSelectedProfile(profile)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-lg font-medium">Available Documents</h3>
                {fetchingDocuments ? (
                  <div>Loading documents...</div>
                ) : documents.length > 0 ? (
                  <ul className="space-y-2 overflow-hidden">
                    {documents.map((doc) => (
                      <Button
                        key={doc.id}
                        onClick={() => setSelectedDocument(doc)}
                        variant={selectedDocument?.id === doc.id ? "default" : "outline"}
                        className="w-full justify-start"
                      >
                        {doc.name} (Uploaded: {doc.uploadDate})
                      </Button>
                    ))}
                  </ul>
                ) : (
                  <p>No documents found. Please upload a document to proceed.</p>
                )}
              </div>
              <div className="w-full md:w-1/2">
                {selectedDocument && (
                  <div className="border p-4 rounded-md">
                    <h4 className="text-lg font-medium mb-2">Document Preview</h4>
                    {selectedDocument.name.endsWith(".docx") ? (
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
                      <iframe src={selectedDocument.url} title="Document Preview" className="w-full h-96 border-0" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-8">
            <div className="mx-0 px-0">
              <div className="flex items-center justify-end gap-2">

                <h3 className="text-lg font-medium">Select Language</h3>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[160px] md:w-[200px] border-zinc-700">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="w-auto p-2">
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {avatarProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`relative cursor-pointer rounded-lg p-4 transition-all ${selectedProfile?.id === profile.id ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-accent"
                    }`}
                  onClick={() => handleProfileSelect(profile)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Image
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                    <span className="font-medium">{profile.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAudio()
                      }}
                    >
                      {isPlaying && selectedProfile?.id === profile.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span className="ml-2">Preview Voice</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Document</h3>
                <p>{selectedDocument?.name}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Language</h3>
                <p>{selectedLanguage}</p>
              </div>
              {selectedProfile && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Avatar Profile</h3>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={selectedProfile.image || "/placeholder.svg"}
                        alt={selectedProfile.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{selectedProfile.name}</p>
                        <Button variant="outline" size="sm" onClick={toggleAudio} className="mt-2">
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          <span className="ml-2">Preview Voice</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Heading title={steps[currentStep].title} description={steps[currentStep].description} />
      <Separator className="my-6" />

      <div className="space-y-6">
        {renderStepContent()}

        {selectedProfile && <audio ref={audioRef} src={selectedProfile.voice} onEnded={() => setIsPlaying(false)} />}

        <div className="flex justify-between mt-6">
          <Button onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
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

export default AvatarCreationForm

