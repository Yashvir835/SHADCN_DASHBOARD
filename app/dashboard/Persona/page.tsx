// "use client"

// import React, { useState } from "react"
// import { useRouter,useSearchParams } from "next/navigation"
// import { useUser } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { ArrowRight } from "lucide-react"
// import { useTheme } from "next-themes"
// import Header from "./_components/Header"
// import FeatureCards from "./_components/FeatureCards"
// import AvatarCreationForm from "./_components/AvatarCreationForm"
// import Footer from "./_components/Footer"
// import { ModeToggle } from "@/components/layout/dark-model-toggle"
// import { useBusinessContext } from "@/app/context/BusinessContext"
// import { Document } from "./type"

// const AvatarExperiencePage: React.FC = () => {
//   const [showForm, setShowForm] = useState(false)
//   const { user } = useUser()
//   const router = useRouter()
//   const { theme } = useTheme()
//   const { selectedBusiness: contextBusiness } = useBusinessContext()

//   const handleCreateAvatar = () => {
//     setShowForm(true)
//   }

//   const handleSubmit = async (data: { document: Document; avatarName: string; image: string; voice: string; language: string }) => {
//     if (user) {
//       try {
//         const userId = user.id
//         const safeBusinessName = contextBusiness ? contextBusiness.replace(/[^a-zA-Z0-9]/g, "_") : "undefined"

//         const Id = `userDetails/${userId}/businesses/${safeBusinessName}`
//         const userEmail = user.primaryEmailAddress?.emailAddress || "No email available"
//         console.log(`hi this is yashvir malik ${data.document.name}, this is audio${data.voice} , this is language ${data.avatarName} , ${data.language}`)
//         const response = await fetch(
//           `/api/experience-avatar?userId=${Id}&document=${data.document.name}&avatarName=${data.avatarName}&image=${data.image}&voice=${data.voice}&userEmail=${userEmail}&language=${data.language}`
//         )
//         const responseData = await response.json()

//         if (response.ok) {
//           router.push(responseData.redirectUrl)
//         } else {
//           console.error("Error:", responseData.message)
//           alert("Something went wrong, please refresh and try again.")
//         }
//       } catch (error) {
//         console.error("Error:", error)
//         alert("Something went wrong, please refresh and try again.")
//       }
//     }
//   }

//   return (
//     <div className="relative min-h-screen overflow-x-hidden">
//             {/* Background Video */}
//       {/* <div className="fixed inset-0 w-full h-full overflow-hidden">
//         <video className="absolute min-h-full min-w-full object-cover" autoPlay loop muted playsInline>
//           <source src="/video/Persona.mp4" type="video/mp4" />
//         </video>
//       </div> */}

//       {/* Content Overlay */}
//       <div className="relative ">
//         {!showForm ? (
//           <div className="text-center animate-fade-in">
//             <p className="text-xl mb-4 text-black">
//               Ready to experience the future of customer interaction?
//             </p>
//             <Button
//               onClick={handleCreateAvatar}
//               size="lg"
//               className="bg-primary hover:bg-primary/90 text-primary-foreground"
//             >
//               Create Your Avatar <ArrowRight className="ml-2" />
//             </Button>
//           </div>
//         ) : (
//           <AvatarCreationForm onSubmit={handleSubmit} />
//         )}
//       </div>
//     </div>
//   )
// }

// export default AvatarExperiencePage

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import Header from "./_components/Header"
import FeatureCards from "./_components/FeatureCards"
import AvatarCreationForm from "./_components/AvatarCreationForm"
import Footer from "./_components/Footer"
import { ModeToggle } from "@/components/layout/dark-model-toggle"
import { useBusinessContext } from "@/app/context/BusinessContext"
import type { Document } from "./type"

const AvatarExperiencePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const { theme } = useTheme()
  const { selectedBusiness: contextBusiness } = useBusinessContext()

  const handleCreateAvatar = () => {
    setShowForm(true)
  }

  const handleSubmit = async (data: {
    document: Document
    avatarName: string
    image: string
    voice: string
    language: string
  }) => {
    if (user) {
      try {
        const userId = user.id
        const safeBusinessName = contextBusiness ? contextBusiness.replace(/[^a-zA-Z0-9]/g, "_") : "undefined"

        const Id = `userDetails/${userId}/businesses/${safeBusinessName}`
        const userEmail = user.primaryEmailAddress?.emailAddress || "No email available"

        // Construct query parameters
        const queryParams = new URLSearchParams({
          userId: Id,
          document: data.document.name,
          avatarName: data.avatarName,
          image: data.image,
          voice: data.voice,
          userEmail: userEmail,
          language: data.language,
        }).toString()

        // Navigate to the interactive-avatar page with query parameters
        router.push(`/interactive-avatar?${queryParams}`)
      } catch (error) {
        console.error("Error:", error)
        alert("Something went wrong, please try again.")
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Content Overlay */}
      <div className="relative">
        {!showForm ? (
          <div className="text-center animate-fade-in">
            <p className="text-xl mb-4 text-black">Ready to experience the future of customer interaction?</p>
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
  )
}

export default AvatarExperiencePage

