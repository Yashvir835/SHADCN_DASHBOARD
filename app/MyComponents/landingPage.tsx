"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Zap, Users } from 'lucide-react'

// import { useClerk } from '@clerk/nextjs';

function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);


  
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          Welcome to Nexus Being Group
        </h1>
        <p className="text-xl sm:text-2xl mb-12">
          Revolutionizing the world of digital humans
        </p>
        <div className="relative">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // onClick={() => }
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>
          {isHovered && (
            <span className="absolute bottom-full mb-2 left-[355px] transform -translate-x-1/2 text-sm text-muted-foreground animate-bounce">
              Sign in to access our product
            </span>
          )}
        </div>
      </div>

      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 text-blue-400" /> AI Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            Seamlessly integrate digital humans with cutting-edge AI technology.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 text-yellow-400" /> Innovation
            </CardTitle>
          </CardHeader>
          <CardContent>
            Transform the way organizations interact and innovate in the digital era.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 text-green-400" /> Human-Centric
            </CardTitle>
          </CardHeader>
          <CardContent>
            Create digital experiences that are intuitive, engaging, and human-centric.
          </CardContent>
        </Card>
      </div>

      <div className="mt-20 text-center animate-fade-in">
        <CardDescription className="text-muted-foreground max-w-2xl mx-auto">
          We are the Nexus Being Group, a pioneering collective dedicated to revolutionizing the world of digital humans. Our mission is to seamlessly integrate digital humans with businesses, transforming the way organizations interact, innovate, and thrive in the digital era.
        </CardDescription>
      </div>
    </div>
  )
}

export default LandingPage

