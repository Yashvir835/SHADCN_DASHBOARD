"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useBusinessContext } from "@/app/context/BusinessContext"
import {  storage } from "@/app/firebase/firebase-config"
// import {    getDownloadURL } from "firebase/storage"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { fetchDocuments } from "@/lib/firebase"
interface Document {
  id: string
  name: string
  url: string
  uploadDate: string
}

export default function StoredDataPage() {
  const { user } = useUser()
  const { selectedBusiness } = useBusinessContext()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [refreshTrigger,setRefreshTrigger] = useState(false) // this will add refresh trigger when user click on the delete button 

  useEffect(() => {
    const getDocuments = async () => {
      if (!user || !selectedBusiness) {
        setError("Please select a business first.")
        setLoading(false)
        return
      }

      try {
        
        const safeBusinessName = selectedBusiness.replace(/[^a-zA-Z0-9]/g, '_')
        const docs = await fetchDocuments(user.id, safeBusinessName, storage)
        setDocuments(docs)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("Failed to fetch documents. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    getDocuments()
  }, [user, selectedBusiness, refreshTrigger])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }
  const handleRefresh = () => setRefreshTrigger(!refreshTrigger); // Toggle refresh trigger

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Stored Documents for {selectedBusiness}</h1>
      <DataTable columns={columns(handleRefresh)} // passing the refresh
       data={documents} 
       
       />
    </div>
  )
}

