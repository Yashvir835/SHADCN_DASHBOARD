"use client"

import { useState } from "react"
import { useClerk } from "@clerk/clerk-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle, BotIcon, Briefcase, Zap, ArrowRight } from 'lucide-react'

const AvatarExperiencePage = () => {
  const [businessName, setBusinessName] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useClerk() 
  const router = useRouter()

  const handleButtonClick = () => {
    setShowInput(true)
  }

  // Method to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (user) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/experience-avatar?userId=${user.id}&businessName=${businessName}`)
        const data = await response.json()

        if (response.ok) {
          // Replace 'data.redirectUrl' with your actual redirect URL
          router.push(data.redirectUrl)
        } else {
          setError(data.message || 'An error occurred')
        }
      } catch (error) {
        console.error('Error:', error)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Experience Your Digital Avatar</h1>
        <p className="text-muted-foreground">
          Bring your business to life with AI-powered digital avatars
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BotIcon className="mr-2 text-primary" /> AI-Powered
            </CardTitle>
          </CardHeader>
          <CardContent>
            AI-powered responses tailored to your business needs and brand voice.
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up [animation-delay:200ms]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 text-primary" /> Seamless Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            Easily integrate with your existing systems and workflows.
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up [animation-delay:400ms]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 text-primary" /> Boost Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            Enhance customer interactions and increase satisfaction rates.
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        {!showInput ? (
          <div className="text-center animate-fade-in">
            <p className="text-xl mb-4">Ready to experience the future of customer interaction?</p>
            <Button
              onClick={handleButtonClick}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Your Avatar <ArrowRight className="ml-2" />
            </Button>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto animate-fade-in">
            <CardHeader>
              <CardTitle>Create Your Avatar</CardTitle>
              <CardDescription>Enter your business details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    type="text"
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="Nexus Beings"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
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
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <CardDescription className="text-muted-foreground max-w-2xl mx-auto">
          Our cutting-edge AI technology creates a unique digital avatar for your business,
          enhancing customer interactions and providing a personalized experience. Join the future of
          digital customer engagement today!
        </CardDescription>
      </div>
    </div>
  )
}

export default AvatarExperiencePage

