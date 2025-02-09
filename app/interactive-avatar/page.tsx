// "use client"

// import { useSearchParams } from "next/navigation"
// import { useEffect, useState } from "react"
// import InteractiveAvatar from "@/components/interactive-avatar/InteractiveAvatar"

// export default function InteractiveAvatarPage() {
//   const searchParams = useSearchParams()
//   const [avatarParams, setAvatarParams] = useState<Record<string, string>>({})

//   useEffect(() => {
//     const params = {
//       userId: searchParams.get("userId") || "",
//       document: searchParams.get("document") || "",
//       avatarName: searchParams.get("avatarName") || "",
//       image: searchParams.get("image") || "",
//       voice: searchParams.get("voice") || "",
//       userEmail: searchParams.get("userEmail") || "",
//       language: searchParams.get("language") || "",
//     }
//     setAvatarParams(params)
//   }, [searchParams])
//   return (
//     <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-2 ">
//       <div className="w-full flex-1  flex flex-col items-center justify-center  ">
//         <div className="w-full  max-w-[90vw] h-[80vh] min-h-[300px] flex flex-col">
//           <InteractiveAvatar {...avatarParams} />
//         </div>
//       </div>
//     </div>
//   );
  
// }


"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import InteractiveAvatar from "@/components/interactive-avatar/InteractiveAvatar"
import DocumentScanner from "@/components/flaskDocumentScanner/documentScanner"

export default function InteractiveAvatarPage() {
  const searchParams = useSearchParams()
  const [avatarParams, setAvatarParams] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = {
      userId: searchParams.get("userId") || "",
      document: searchParams.get("document") || "",
      avatarName: searchParams.get("avatarName") || "",
      image: searchParams.get("image") || "",
      voice: searchParams.get("voice") || "",
      userEmail: searchParams.get("userEmail") || "",
      language: searchParams.get("language") || "",
    }
    setAvatarParams(params)
  }, [searchParams])

  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-2 ">
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-[90vw] h-[80vh] min-h-[300px] flex flex-col">
          <InteractiveAvatar {...avatarParams} />
        </div>
      </div>
      <div className="mt-4">
        <DocumentScanner />
      </div>
    </div>
  )
}

