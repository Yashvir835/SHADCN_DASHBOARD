import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BotIcon, Briefcase, Zap } from 'lucide-react'

const FeatureCards: React.FC = () => (
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
)

export default FeatureCards

