"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import Header from './_components/Header'
import FeatureCards from './_components/FeatureCards'
import AvatarCreationForm from './_components/AvatarCreationForm'
import Footer from './_components/Footer'
import BackgroundAnimation from './_components/BackgroundAnimation'
import { ModeToggle } from "@/components/layout/dark-model-toggle";

const AvatarExperiencePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const { theme } = useTheme()

  const handleCreateAvatar = () => {
    setShowForm(true)
  }

  const handleSubmit = async (data: { business: string, avatarName: string, image: string, voice: string }) => {
    if (user) {
      try {
        
        const userId = user.id
        const Id = `userDetails/${userId}/businesses/${data.business}`
        const userEmail = user.primaryEmailAddress?.emailAddress || 'No email available'
        const response = await fetch(`/api/experience-avatar?userId=${Id}&business=${data.business}&avatarName=${data.avatarName}&image=${data.image}&voice=${data.voice}&userEmail=${userEmail}`)
        const responseData = await response.json()

        if (response.ok) {
          router.push(responseData.redirectUrl)
        } else {
          console.error('Error:', responseData.message)
          alert('Something Wrong happen please refresh and made request again')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Something Wrong happen please refresh and made request again')
      }
    }
  }

  return (
    <div className="relative min-h-screen p-6 space-y-8 animate-fade-in">
      {theme === 'dark' && <BackgroundAnimation />}
     
      <Header />
      <FeatureCards />
      <div className="mt-8">
        {!showForm ? (
          <div className="text-center animate-fade-in">
            <p className="text-xl mb-4">Ready to experience the future of customer interaction?</p>
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
      <Footer />
    </div>
  )
}

export default AvatarExperiencePage

