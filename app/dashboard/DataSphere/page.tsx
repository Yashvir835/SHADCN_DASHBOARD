"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/app/firebase/firebase-config"
import { columns, Business } from "./columns"
import { DataTable } from "./data-table"

export default function StoredDataPage() {
  const { user } = useUser()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) {
        setError("You lost your internet connection try to refresh")
        setLoading(false)
        return
      }

      try {
        const userId = user.id
        const businessesCollection = collection(db, `userDetails/${userId}/businesses`)
        const businessSnapshots = await getDocs(businessesCollection)

        const businessData = businessSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Business[]

        setBusinesses(businessData)
      } catch (err) {
        console.error("Error fetching businesses:", err)
        setError("Failed to fetch businesses. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Stored Business Data</h1>
      <DataTable columns={columns} data={businesses} />
    </div>
  )
}

