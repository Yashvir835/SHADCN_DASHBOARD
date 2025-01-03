import React from 'react'
import { Loader } from 'lucide-react'

function loading() {
  return (
    <div className='flex flex-col justify-center items-center  mt-10'>
      <div className='flex flex-row items-center '>
        <Loader className="animate-spin h-20 w-20 text-gray-500" strokeWidth={1} viewBox="0 0 24 24" />
        <span className="text-gray-500 ml-3">Loading...</span>
      </div>
    </div>
  )
}

export default loading