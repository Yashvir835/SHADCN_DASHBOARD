
import React from 'react'
import {SparklesPreview} from "@/components/landingPage/headerBlack"
import {MarqueeDemo} from "@/components/landingPage/testimonials"
import { Footerdemo } from '@/components/ui/footer-section'
import { LampDemo } from '@/components/landingPage/lamp'
import { Separator } from "@/components/ui/separator"
import { SpotLightItem, Spotlight } from '@/components/core/main-spotlight';

function landingPage() {
  return (

    <span className='scroll-smooth bg-black'>
      <Spotlight >
        <SpotLightItem >
       
     <SparklesPreview/>
     {/* <Separator/> */}
     <span className='gap-0'>
      <MarqueeDemo/>
      <LampDemo/>
      </span>
      <Footerdemo/>
          </SpotLightItem>
      </Spotlight>
    </span>

  )
}

export default landingPage
