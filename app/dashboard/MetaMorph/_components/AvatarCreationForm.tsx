"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useBusinessContext } from "@/app/context/BusinessContext"
import { useUser } from "@clerk/nextjs"
import { avatarImages, audioAssets } from "./data"
import { storage } from "@/app/firebase/firebase-config"
import { ref, listAll, getMetadata, getDownloadURL } from "firebase/storage"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

interface AvatarCreationFormProps {
  onSubmit: (data: { document: Document; avatarName: string; image: string; voice: string }) => void
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
  const [selectedAvatarName, setSelectedAvatarName] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
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
    { title: "Select a Document", description: "Choose a document as your knowledge base" },
    { title: "Choose Avatar Name", description: "Select a name for your avatar" },
    { title: "Select Avatar Image", description: "Choose an image for your avatar" },
    { title: "Select Avatar Voice", description: "Choose a voice for your avatar" },
    { title: "Review and Submit", description: "Review your selections and create your avatar" },
  ]

  const handleSubmit = () => {
    if (selectedDocument && selectedAvatarName && selectedImage && selectedVoice) {
      setIsLoading(true)
      setError(null)
      onSubmit({
        document: selectedDocument,
        avatarName: selectedAvatarName,
        image: selectedImage,
        voice: selectedVoice,
      })
    } else {
      setError("Please complete all steps before submitting.")
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

  const nextAudio = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % Object.keys(audioAssets).length)
  }

  const prevAudio = () => {
    setCurrentAudioIndex(
      (prevIndex) => (prevIndex - 1 + Object.keys(audioAssets).length) % Object.keys(audioAssets).length,
    )
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

  const selectVoice = () => {
    setSelectedVoice(Object.keys(audioAssets)[currentAudioIndex])
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-lg font-medium">Available Documents</h3>
              {fetchingDocuments ? (
                <div>Loading documents...</div>
              ) : documents.length > 0 ? (
                <ul className="space-y-2">
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
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedDocument.url)}`}
                      width="100%"
                      height="500px"
                      frameBorder="0"
                    >
                      This is an embedded{" "}
                      <a target="_blank" href="http://office.com" rel="noreferrer">
                        Microsoft Office
                      </a>{" "}
                      document, powered by{" "}
                      <a target="_blank" href="http://office.com/webapps" rel="noreferrer">
                        Office Online
                      </a>
                      .
                    </iframe>
                  ) : (
                    <iframe src={selectedDocument.url} title="Document Preview" className="w-full h-96 border-0" />
                  )}
                </div>
              )}
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            {["Alex", "Sam", "Jordan", "Taylor"].map((name) => (
              <Button
                key={name}
                onClick={() => setSelectedAvatarName(name)}
                variant={selectedAvatarName === name ? "default" : "outline"}
                className="w-full justify-start"
              >
                {name}
              </Button>
            ))}
          </div>
        )
      case 2:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {Object.entries(avatarImages).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => setSelectedImage(key)}
                variant={selectedImage === key ? "default" : "outline"}
                className="p-2 rounded-full w-24 h-24 flex items-center justify-center"
              >
                <Image
                  src={value || "/placeholder.svg"}
                  alt={`Avatar ${key}`}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </Button>
            ))}
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden">
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src="/video/sample.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button onClick={prevAudio} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <p className="font-medium">{Object.keys(audioAssets)[currentAudioIndex]}</p>
                <audio ref={audioRef} src={Object.values(audioAssets)[currentAudioIndex]} />
                <Button onClick={toggleAudio} variant="outline" size="sm" className="mt-2">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={nextAudio} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={selectVoice}
              variant={selectedVoice === Object.keys(audioAssets)[currentAudioIndex] ? "default" : "outline"}
              className="w-full"
            >
              Select this voice
            </Button>
          </div>
        )
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Document</h3>
              <p>{selectedDocument?.name}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Avatar Name</h3>
              <p>{selectedAvatarName}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Avatar Image</h3>
              {selectedImage && (
                <Image
                  src={avatarImages[selectedImage] || "/placeholder.svg"}
                  alt={`Selected Avatar`}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Avatar Voice</h3>
              <div className="flex items-center space-x-2">
                <span>{selectedVoice}</span>
                <Button onClick={toggleAudio} variant="outline" size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              <audio ref={audioRef} src={audioAssets[selectedVoice]} />
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

        <div className="flex justify-between mt-6">
          <Button onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
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
          ) : (
            <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
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

