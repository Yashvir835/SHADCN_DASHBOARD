// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Camera, Upload } from "lucide-react"

// export default function DocumentScanner() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [capturedImage, setCapturedImage] = useState<string | null>(null)
//   const [scanResult, setScanResult] = useState<Record<string, any> | null>(null)

//   const captureImage = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
//       const video = document.createElement("video")
//       video.srcObject = stream
//       await video.play()

//       const canvas = document.createElement("canvas")
//       canvas.width = video.videoWidth
//       canvas.height = video.videoHeight
//       canvas.getContext("2d")?.drawImage(video, 0, 0)

//       const imageDataUrl = canvas.toDataURL("image/jpeg")
//       setCapturedImage(imageDataUrl)

//       // Stop the camera stream
//       stream.getTracks().forEach((track) => track.stop())

//       // Send the image to the Flask backend
//       const response = await fetch("/api/scan-document", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ image: imageDataUrl }),
//       })

//       if (response.ok) {
//         const result = await response.json()
//         setScanResult(result)
//       } else {
//         console.error("Error scanning document")
//       }
//     } catch (error) {
//       console.error("Error accessing camera:", error)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Upload className="mr-2 h-4 w-4" />
//           Upload Attachments
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Document Scanner</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           {!capturedImage ? (
//             <Button onClick={captureImage}>
//               <Camera className="mr-2 h-4 w-4" />
//               Capture Document
//             </Button>
//           ) : (
//             <div className="space-y-4">
//               <img src={capturedImage || "/placeholder.svg"} alt="Captured document" className="w-full" />
//               {scanResult && (
//                 <div className="bg-muted p-4 rounded-md">
//                   <h3 className="font-semibold mb-2">Scan Result:</h3>
//                   <pre className="text-sm overflow-auto">{JSON.stringify(scanResult, null, 2)}</pre>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, Upload, ImagePlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentScanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<Record<string, any> | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const captureImage = async () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)

    const imageDataUrl = canvas.toDataURL("image/jpeg")
    setCapturedImage(imageDataUrl)

    // Stop the camera stream
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null

    await processImage(imageDataUrl)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const imageDataUrl = reader.result as string
      setCapturedImage(imageDataUrl)
      await processImage(imageDataUrl)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (imageDataUrl: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/scan-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      })

      if (response.ok) {
        const result = await response.json()
        setScanResult(result)
      } else {
        console.error("Error scanning document")
      }
    } catch (error) {
      console.error("Error processing image:", error)
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          streamRef.current?.getTracks().forEach(track => track.stop())
          streamRef.current = null
          setCapturedImage(null)
          setScanResult(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload Attachments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Scanner</DialogTitle>
        </DialogHeader>
        {!capturedImage ? (
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                <video ref={videoRef} className="w-full rounded-md" autoPlay playsInline />
                <Button onClick={() => {
                  if (!streamRef.current) {
                    startCamera()
                  } else {
                    captureImage()
                  }
                }}>
                  <Camera className="mr-2 h-4 w-4" />
                  {!streamRef.current ? "Start Camera" : "Capture Document"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <img src={capturedImage} alt="Captured document" className="w-full rounded-md" />
            { (
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">Scan Result:</h3>
                <pre className="text-sm overflow-auto">{JSON.stringify(scanResult, null, 2)}</pre>
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setCapturedImage(null)
                setScanResult(null)
              }}
            >
              Scan Another Document
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}