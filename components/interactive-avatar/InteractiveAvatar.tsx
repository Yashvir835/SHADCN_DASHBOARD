// "use client"

// import type { StartAvatarResponse } from "@heygen/streaming-avatar"
// import StreamingAvatar, {
//   AvatarQuality,
//   StreamingEvents,
//   TaskMode,
//   TaskType,
//   VoiceEmotion,
// } from "@heygen/streaming-avatar"
// import { Button, Card, CardBody, Select, SelectItem, Spinner, Input } from "@nextui-org/react"
// import { useEffect, useRef, useState } from "react"
// import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants"
// import { Mic, Maximize2, Minimize2, Send } from "lucide-react"
// import { ScrollArea } from "@/components/ui/scroll-area"

// export default function InteractiveAvatar() {
//   const [isLoadingSession, setIsLoadingSession] = useState(false)
//   const [stream, setStream] = useState<MediaStream>()
//   const [debug, setDebug] = useState<string>()
//   const [knowledgeId, setKnowledgeId] = useState<string>("")
//   const [avatarId, setAvatarId] = useState<string>("")
//   const [language, setLanguage] = useState<string>("en")
//   const [data, setData] = useState<StartAvatarResponse>()
//   const mediaStream = useRef<HTMLVideoElement>(null)
//   const avatar = useRef<StreamingAvatar | null>(null)
//   const [isAvatarTalking, setIsAvatarTalking] = useState(false)
//   const [isRecording, setIsRecording] = useState(false)
//   const [error, setError] = useState("")
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const audioChunksRef = useRef<Blob[]>([])
//   const [isTouchRecording, setIsTouchRecording] = useState(false)
//   const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
//   const [isMaximized, setIsMaximized] = useState(false)
//   const scrollAreaRef = useRef<HTMLDivElement>(null)
//   const [textInput, setTextInput] = useState("")
//   const [isTextInputDisabled, setIsTextInputDisabled] = useState(true)

//   async function fetchAccessToken() {
//     try {
//       const response = await fetch("/api/get-access-token", {
//         method: "POST",
//       })
//       const token = await response.text()
//       console.log("Access Token:", token)
//       return token
//     } catch (error) {
//       console.error("Error fetching access token:", error)
//     }
//     return ""
//   }

//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         mediaRecorderRef.current = new MediaRecorder(stream, {
//           mimeType: "audio/webm;codecs=opus",
//           audioBitsPerSecond: 128000,
//         })

//         mediaRecorderRef.current.ondataavailable = (event) => {
//           if (event.data.size > 0) {
//             audioChunksRef.current.push(event.data)
//           }
//         }

//         mediaRecorderRef.current.onstop = async () => {
//           const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
//           audioChunksRef.current = []

//           // Convert WebM to WAV
//           const wavBlob = await convertToWav(audioBlob)

//           const formData = new FormData()
//           formData.append("audio", wavBlob, "audio.wav")

//           try {
//             const response = await fetch("http://127.0.0.1:5000/chat", {
//               method: "POST",
//               body: formData,
//             })

//             if (!response.ok) {
//               throw new Error("Failed to fetch response from AI agent.")
//             }

//             const data = await response.json()
//             setMessages((prevMessages) => [
//               ...prevMessages,
//               { role: "user", content: data.transcription },
//               { role: "assistant", content: data.response },
//             ])
//             if (data.response) {
//               await speakResponse(data.response)
//             }
//           } catch (err) {
//             setError(err.message)
//           }
//         }
//       })
//       .catch((err) => {
//         setError("Error accessing microphone: " + err.message)
//       })
//   }, [])

//   useEffect(() => {
//     if (scrollAreaRef.current) {
//       const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
//       if (scrollElement) {
//         scrollElement.scrollTop = scrollElement.scrollHeight
//       }
//     }
//   }, [messages])

//   const startRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
//       audioChunksRef.current = []
//       mediaRecorderRef.current.start()
//       setIsRecording(true)
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
//       mediaRecorderRef.current.stop()
//       setIsRecording(false)
//     }
//   }

//   async function speakResponse(text: string) {
//     if (!avatar.current) {
//       setDebug("Avatar API not initialized")
//       return
//     }
//     await avatar.current.speak({ text, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC }).catch((e) => {
//       setDebug(e.message)
//     })
//   }

//   async function startSession() {
//     setIsLoadingSession(true)
//     const newToken = await fetchAccessToken()

//     avatar.current = new StreamingAvatar({
//       token: newToken,
//     })
//     avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
//       console.log("Avatar started talking", e)
//       setIsAvatarTalking(true)
//       setIsTextInputDisabled(true)
//     })
//     avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
//       console.log("Avatar stopped talking", e)
//       setIsAvatarTalking(false)
//       setIsTextInputDisabled(false)
//     })
//     avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
//       console.log("Stream disconnected")
//       endSession()
//     })
//     avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
//       console.log("Stream ready:", event.detail)
//       setStream(event.detail)
//       setIsTextInputDisabled(false)
//     })
//     try {
//       const res = await avatar.current.createStartAvatar({
//         quality: AvatarQuality.Low,
//         avatarName: avatarId,
//         knowledgeId: knowledgeId,
//         voice: {
//           rate: 1.5,
//           emotion: VoiceEmotion.EXCITED,
//         },
//         language: language,
//         disableIdleTimeout: true,
//       })

//       setData(res)
//     } catch (error) {
//       console.error("Error starting avatar session:", error)
//     } finally {
//       setIsLoadingSession(false)
//     }
//   }

//   async function endSession() {
//     await avatar.current?.stopAvatar()
//     setStream(undefined)
//     setIsTextInputDisabled(true)
//   }

//   useEffect(() => {
//     return () => {
//       endSession()
//     }
//   }, [])

//   useEffect(() => {
//     if (stream && mediaStream.current) {
//       mediaStream.current.srcObject = stream
//       mediaStream.current.onloadedmetadata = () => {
//         mediaStream.current!.play()
//         setDebug("Playing")
//       }
//     }
//   }, [mediaStream, stream])

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.code === "Space" && !isAvatarTalking && stream) {
//         startRecording()
//       }
//     }

//     const handleKeyUp = (e: KeyboardEvent) => {
//       if (e.code === "Space" && isRecording) {
//         stopRecording()
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     window.addEventListener("keyup", handleKeyUp)

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown)
//       window.removeEventListener("keyup", handleKeyUp)
//     }
//   }, [isAvatarTalking, stream, isRecording])

//   const handleTouchStart = () => {
//     if (!isAvatarTalking && stream) {
//       startRecording()
//       setIsTouchRecording(true)
//     }
//   }

//   const handleTouchEnd = () => {
//     if (isTouchRecording) {
//       stopRecording()
//       setIsTouchRecording(false)
//     }
//   }

//   const toggleMaximize = () => {
//     setIsMaximized(!isMaximized)
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       handleTextSubmit()
//     }
//   }

//   const handleTextSubmit = async () => {
//     if (!textInput.trim()) return
//     setMessages([...messages, { role: "user", content: textInput }])
//     setTextInput("")
//     try {
//       const response = await fetch("http://127.0.0.1:5000/text_chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: textInput }),
//       })
//       if (!response.ok) {
//         throw new Error("Failed to fetch response from AI agent.")
//       }
//       const data = await response.json()
//       setMessages([...messages, { role: "user", content: textInput }, { role: "assistant", content: data.response }])
//       await speakResponse(data.response)
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   // Function to convert WebM to WAV
//   const convertToWav = async (webmBlob: Blob): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)()
//       const fileReader = new FileReader()

//       fileReader.onload = async (event) => {
//         const arrayBuffer = event.target?.result as ArrayBuffer
//         const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

//         const wavBuffer = audioBufferToWav(audioBuffer)
//         const wavBlob = new Blob([wavBuffer], { type: "audio/wav" })
//         resolve(wavBlob)
//       }

//       fileReader.onerror = (error) => {
//         reject(error)
//       }

//       fileReader.readAsArrayBuffer(webmBlob)
//     })
//   }

//   // Function to convert AudioBuffer to WAV format
//   const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
//     const numOfChan = buffer.numberOfChannels
//     const length = buffer.length * numOfChan * 2 + 44
//     const outBuffer = new ArrayBuffer(length)
//     const view = new DataView(outBuffer)
//     const channels = []
//     let sample = 0
//     let offset = 0
//     let pos = 0

//     // write WAVE header
//     setUint32(0x46464952) // "RIFF"
//     setUint32(length - 8) // file length - 8
//     setUint32(0x45564157) // "WAVE"

//     setUint32(0x20746d66) // "fmt " chunk
//     setUint32(16) // length = 16
//     setUint16(1) // PCM (uncompressed)
//     setUint16(numOfChan)
//     setUint32(buffer.sampleRate)
//     setUint32(buffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
//     setUint16(numOfChan * 2) // block-align
//     setUint16(16) // 16-bit (hardcoded in this demo)

//     setUint32(0x61746164) // "data" - chunk
//     setUint32(length - pos - 4) // chunk length

//     // write interleaved data
//     for (let i = 0; i < buffer.numberOfChannels; i++) {
//       channels.push(buffer.getChannelData(i))
//     }

//     while (pos < length) {
//       for (let i = 0; i < numOfChan; i++) {
//         // interleave channels
//         sample = Math.max(-1, Math.min(1, channels[i][offset])) // clamp
//         sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0 // scale to 16-bit signed int
//         view.setInt16(pos, sample, true) // write 16-bit sample
//         pos += 2
//       }
//       offset++ // next source sample
//     }

//     return outBuffer

//     function setUint16(data: number) {
//       view.setUint16(pos, data, true)
//       pos += 2
//     }

//     function setUint32(data: number) {
//       view.setUint32(pos, data, true)
//       pos += 4
//     }
//   }

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-2 sm:p-4">
//       <Card className="w-full h-full max-w-6xl bg-gray-800/90 border-none shadow-none overflow-hidden">
//         <CardBody className="h-full flex flex-col justify-center items-center p-2 sm:p-4">
//           {stream ? (
//             <div className={`w-full h-full flex flex-col ${isMaximized ? "" : "sm:flex-row"} gap-2 sm:gap-4`}>
//               <div
//                 className={`relative ${isMaximized ? "w-full h-full" : "w-full sm:w-2/3 h-full"} bg-black rounded-lg overflow-hidden`}
//               >
//                 <video ref={mediaStream} autoPlay playsInline className="w-full h-full object-cover">
//                   <track kind="captions" />
//                 </video>
//                 <div className="absolute top-2 right-2 z-10">
//                   <Button
//                     size="sm"
//                     variant="flat"
//                     color="primary"
//                     isIconOnly
//                     onClick={toggleMaximize}
//                     className="bg-gray-800/50 hover:bg-gray-700/50"
//                   >
//                     {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
//                   </Button>
//                 </div>
//                 <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center z-10">
//                   <div className="bg-gray-900/80 text-blue-300 px-4 py-2 rounded-full text-sm">
//                     {isAvatarTalking ? "Avatar is talking..." : isRecording ? "Recording..." : "Ready"}
//                   </div>
//                   <Button
//                     size="sm"
//                     color={isRecording ? "danger" : "primary"}
//                     variant="shadow"
//                     onTouchStart={handleTouchStart}
//                     onTouchEnd={handleTouchEnd}
//                     onMouseDown={startRecording}
//                     onMouseUp={stopRecording}
//                     className="rounded-full text-xs sm:text-sm"
//                   >
//                     <Mic size={16} className="mr-1 sm:mr-2" />
//                     {isRecording ? "Recording..." : "Hold to Record"}
//                   </Button>
//                 </div>
//                 <Button
//                   className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 transition-all duration-300 ease-in-out transform hover:scale-105"
//                   size="sm"
//                   variant="shadow"
//                   onClick={endSession}
//                 >
//                   End Session
//                 </Button>
//               </div>
//               {!isMaximized && (
//                 <div className="w-full sm:w-1/3 h-full bg-gray-700/50 rounded-lg overflow-hidden flex flex-col">
//                   <ScrollArea className="flex-grow p-4 h-[calc(100%-60px)]" ref={scrollAreaRef}>
//                     {messages.map((message, index) => (
//                       <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
//                         <div
//                           className={`inline-block p-3 rounded-lg ${
//                             message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-600 text-blue-100"
//                           }`}
//                         >
//                           {message.content}
//                         </div>
//                       </div>
//                     ))}
//                   </ScrollArea>

//                   {/* Text Input Section */}
//                   <div className="p-4 border-t border-gray-600 flex items-center space-x-2 h-[60px]">
//                     <Input
//                       value={textInput}
//                       onChange={(e) => setTextInput(e.target.value)}
//                       onKeyDown={handleKeyPress}
//                       placeholder="Type a message..."
//                       disabled={isTextInputDisabled || isAvatarTalking}
//                       className="flex-grow"
//                       variant="bordered"
//                     />
//                     <Button
//                       isIconOnly
//                       color="primary"
//                       variant="shadow"
//                       onClick={handleTextSubmit}
//                       disabled={!textInput.trim() || isTextInputDisabled || isAvatarTalking}
//                       className="rounded-full"
//                     >
//                       <Send size={20} />
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : !isLoadingSession ? (
//             <div className="w-full max-w-xs sm:max-w-md space-y-4 sm:space-y-6">
//               <h2 className="text-3xl font-bold text-blue-300 text-center">Interactive AI Avatar</h2>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label htmlFor="knowledgeId" className="text-sm font-medium text-blue-300">
//                     Custom Knowledge ID (optional)
//                   </label>
//                   <input
//                     id="knowledgeId"
//                     className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 border border-blue-500 text-blue-100 placeholder-blue-300/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
//                     placeholder="Enter a custom knowledge ID"
//                     value={knowledgeId}
//                     onChange={(e) => setKnowledgeId(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="avatarId" className="text-sm font-medium text-blue-300">
//                     Custom Avatar ID (optional)
//                   </label>
//                   <input
//                     id="avatarId"
//                     className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 border border-blue-500 text-blue-100 placeholder-blue-300/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
//                     placeholder="Enter a custom avatar ID"
//                     value={avatarId}
//                     onChange={(e) => setAvatarId(e.target.value)}
//                   />
//                 </div>
//                 <Select
//                   label="Select an avatar"
//                   placeholder="Choose from example avatars"
//                   className="w-full text-sm sm:text-base"
//                   onChange={(e) => {
//                     setAvatarId(e.target.value)
//                   }}
//                 >
//                   {AVATARS.map((avatar) => (
//                     <SelectItem key={avatar.avatar_id} textValue={avatar.avatar_id}>
//                       {avatar.name}
//                     </SelectItem>
//                   ))}
//                 </Select>
//                 <Select
//                   label="Select language"
//                   placeholder="Choose a language"
//                   className="w-full text-sm sm:text-base"
//                   selectedKeys={[language]}
//                   onChange={(e) => {
//                     setLanguage(e.target.value)
//                   }}
//                 >
//                   {STT_LANGUAGE_LIST.map((lang) => (
//                     <SelectItem key={lang.key}>{lang.label}</SelectItem>
//                   ))}
//                 </Select>
//               </div>
//               <Button
//                 className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-base sm:text-lg font-semibold py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
//                 size="lg"
//                 onClick={startSession}
//               >
//                 Start Interactive Session
//               </Button>
//               <p className="text-blue-200 text-sm text-center">
//                 Press and hold spacebar to record once the session starts
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4">
//               <Spinner color="primary" size="lg" />
//               <p className="text-blue-300 text-base sm:text-lg">Initializing AI Avatar...</p>
//             </div>
//           )}
//         </CardBody>
//       </Card>
//       {debug && (
//         <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 max-w-[calc(100%-1rem)] sm:max-w-xs bg-gray-800/90 border border-blue-500 rounded-lg p-2 sm:p-4 shadow-lg z-50">
//           <p className="font-mono text-xs text-blue-300 break-words">
//             <span className="font-bold text-blue-400">Console:</span>
//             <br />
//             {debug}
//           </p>
//         </div>
//       )}
//       <style jsx>{`
//         @media (max-width: 640px) {
//           input, select, button {
//             font-size: 16px; /* Prevents zoom on focus in iOS */
//           }
//         }
//         @media (max-height: 600px) and (orientation: landscape) {
//           .min-h-screen {
//             min-height: 100vh;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }
"use client"

import type { StartAvatarResponse } from "@heygen/streaming-avatar"
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar"
import { Button, Card, CardBody, Spinner, Input } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react"
import { Mic, Maximize2, Minimize2, Send, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InteractiveAvatarProps {
  userId: string
  document: string
  avatarName: string
  image: string
  voice: string
  userEmail: string
  language: string
}

export default function InteractiveAvatar({
  userId,
  document,
  avatarName,
  image,
  voice,
  userEmail,
  language,
}: InteractiveAvatarProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [stream, setStream] = useState<MediaStream>()
  const [data, setData] = useState<StartAvatarResponse>()
  const mediaStream = useRef<HTMLVideoElement>(null)
  const avatar = useRef<StreamingAvatar | null>(null)
  const [isAvatarTalking, setIsAvatarTalking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isMaximized, setIsMaximized] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [textInput, setTextInput] = useState("")
  const [isTextInputDisabled, setIsTextInputDisabled] = useState(true)

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      })
      const token = await response.text()
      return token
    } catch (error) {
      console.error("Error fetching access token:", error)
    }
    return ""
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
          audioBitsPerSecond: 128000,
        })

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          audioChunksRef.current = []

          // Convert WebM to WAV
          const wavBlob = await convertToWav(audioBlob)

          const formData = new FormData()
          formData.append("audio", wavBlob, "audio.wav")

          try {
            const response = await fetch("http://127.0.0.1:5000/chat", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              throw new Error("Failed to fetch response from AI agent.")
            }

            const data = await response.json()
            setMessages((prevMessages) => [
              ...prevMessages,
              { role: "user", content: data.transcription },
              { role: "assistant", content: data.response },
            ])
            if (data.response) {
              await speakResponse(data.response)
            }
          } catch (err) {
            setError(err.message)
          }
        }
      })
      .catch((err) => {
        setError("Error accessing microphone: " + err.message)
      })
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages]) //Corrected dependency

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      audioChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  async function speakResponse(text: string) {
    if (!avatar.current) {
      console.error("Avatar API not initialized")
      return
    }
    await avatar.current.speak({ text, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC }).catch((e) => {
      console.error(e.message)
    })
  }

  async function startSession() {
    setIsLoadingSession(true)
    const newToken = await fetchAccessToken()

    avatar.current = new StreamingAvatar({
      token: newToken,
    })
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
      setIsAvatarTalking(true)
      setIsTextInputDisabled(true)
    })
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
      setIsAvatarTalking(false)
      setIsTextInputDisabled(false)
    })
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      endSession()
    })
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      setStream(event.detail)
      setIsTextInputDisabled(false)
    })
    try {
      if (language.toLowerCase() === 'hi') {
        language = 'hi';
      } else {
        language = 'en';
      }
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: "Kayla-incasualsuit-20220818",
        knowledgeId: document,
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.FRIENDLY,
        },
        language: language,
        disableIdleTimeout: true,
      })

      setData(res)
    } catch (error) {
      console.error("Error starting avatar session:", error)
    } finally {
      setIsLoadingSession(false)
    }
  }

  async function endSession() {
    await avatar.current?.stopAvatar()
    setStream(undefined)
    setIsTextInputDisabled(true)
  }

  useEffect(() => {
    startSession()
    return () => {
      endSession()
    }
  }, [])

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play()
      }
    }
  }, [mediaStream, stream])

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleTextSubmit()
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return
    setMessages([...messages, { role: "user", content: textInput }])
    setTextInput("")
    try {
      const response = await fetch("http://127.0.0.1:5000/text_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textInput }),
      })
      if (!response.ok) {
        throw new Error("Failed to fetch response from AI agent.")
      }
      const data = await response.json()
      setMessages([...messages, { role: "user", content: textInput }, { role: "assistant", content: data.response }])
      await speakResponse(data.response)
    } catch (error) {
      setError(error.message)
    }
  }

  // Function to convert WebM to WAV
  const convertToWav = async (webmBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const fileReader = new FileReader()

      fileReader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        const wavBuffer = audioBufferToWav(audioBuffer)
        const wavBlob = new Blob([wavBuffer], { type: "audio/wav" })
        resolve(wavBlob)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }

      fileReader.readAsArrayBuffer(webmBlob)
    })
  }

  // Function to convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numOfChan = buffer.numberOfChannels
    const length = buffer.length * numOfChan * 2 + 44
    const outBuffer = new ArrayBuffer(length)
    const view = new DataView(outBuffer)
    const channels = []
    let sample = 0
    let offset = 0
    let pos = 0

    // write WAVE header
    setUint32(0x46464952) // "RIFF"
    setUint32(length - 8) // file length - 8
    setUint32(0x45564157) // "WAVE"

    setUint32(0x20746d66) // "fmt " chunk
    setUint32(16) // length = 16
    setUint16(1) // PCM (uncompressed)
    setUint16(numOfChan)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
    setUint16(numOfChan * 2) // block-align
    setUint16(16) // 16-bit (hardcoded in this demo)

    setUint32(0x61746164) // "data" - chunk
    setUint32(length - pos - 4) // chunk length

    // write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])) // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0 // scale to 16-bit signed int
        view.setInt16(pos, sample, true) // write 16-bit sample
        pos += 2
      }
      offset++ // next source sample
    }

    return outBuffer

    function setUint16(data: number) {
      view.setUint16(pos, data, true)
      pos += 2
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true)
      pos += 4
    }
  }

  return (
    <div className=" h-screen flex items-center justify-center  sm:p-4  
       w-full mt-0">
      <Card className="w-full h-full max-w-6xl bg-white border-none shadow-none overflow-hidden">
        <CardBody className="h-full flex flex-col justify-center items-center p-2 sm:p-4">
          {stream ? (
            <div className={`w-full h-full flex flex-col ${isMaximized ? "" : "sm:flex-row"} gap-2 sm:gap-4`}>
              <div
                className={`relative ${isMaximized ? "w-full h-full" : "w-full sm:w-2/3 h-full"} bg-black rounded-lg overflow-hidden`}
              >
                <video ref={mediaStream} autoPlay playsInline className="w-full h-full object-cover">
                  <track kind="captions" />
                </video>
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    size="sm"
                    variant="flat"
                    color="default"
                    isIconOnly
                    onClick={toggleMaximize}
                    className="bg-white/50 hover:bg-white/70"
                  >
                    {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center z-10">
                  <div className="bg-white/80 text-black px-4 py-2 rounded-full text-sm">
                    {isAvatarTalking ? "Avatar is talking..." : isRecording ? "Recording..." : "Ready"}
                  </div>
                  <Button
                    size="sm"
                    color={isRecording ? "danger" : "primary"}
                    variant="shadow"
                    onClick={isRecording ? stopRecording : startRecording}
                    className="rounded-full text-xs sm:text-sm"
                  >
                    <Mic size={16} className="mr-1 sm:mr-2" />
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="shadow"
                    onClick={endSession}
                    className="rounded-full text-xs sm:text-sm"
                  >
                    <X size={16} className="mr-1 sm:mr-2" />
                    Close
                  </Button>
                </div>
              </div>
              {!isMaximized && (
                <div className="w-full sm:w-1/3 h-full bg-gray-100 rounded-lg overflow-hidden flex flex-col">
                  <ScrollArea className="flex-grow p-4 h-[calc(100%-60px)]" ref={scrollAreaRef}>
                    {messages.map((message, index) => (
                      <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <div
                          className={`inline-block p-3 rounded-lg ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                            }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>

                  {/* Text Input Section */}
                  <div className="p-4 border-t border-gray-300 flex items-center space-x-2 h-[60px]">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={isTextInputDisabled || isAvatarTalking}
                      className="flex-grow"
                      variant="bordered"
                    />
                    <Button
                      isIconOnly
                      color="primary"
                      variant="shadow"
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim() || isTextInputDisabled || isAvatarTalking}
                      className="rounded-full"
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4">
              <Spinner color="default" size="lg" />
              <p className="text-black text-base sm:text-lg">Initializing AI Avatar...</p>
            </div>
          )}
        </CardBody>
      </Card>
      <style jsx>{`
        @media (max-width: 640px) {
          input, select, button {
            font-size: 16px; /* Prevents zoom on focus in iOS */
          }
        }

        @media (max-height: 600px) and (orientation: landscape) {
          .min-h-screen {
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  )
}

