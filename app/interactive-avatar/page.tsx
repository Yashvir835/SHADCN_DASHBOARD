"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import InteractiveAvatar from "@/components/interactive-avatar/InteractiveAvatar"

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
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[900px] flex flex-col items-center justify-center gap-5">
        <div className="w-full">
          <InteractiveAvatar {...avatarParams} />
        </div>
      </div>
    </div>
  );
  
}

