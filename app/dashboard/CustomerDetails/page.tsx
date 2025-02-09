"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
// import { useBusinessContext } from "@/app/context/BusinessContext"
import { db } from "@/app/firebase/firebase-config"
import { collection, getDocs } from "firebase/firestore"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string,
  phoneNumber: string
  createdAt: string
}

export default function StoredCustomerPage() {
  const { user } = useUser()
  // const { selectedBusiness } = useBusinessContext()
  const [customers, setCustomers] = useState<Customer[]>([])
  const selectedBusiness = sessionStorage.getItem("selectedBusiness");

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(false) // Refresh trigger

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user || !selectedBusiness) {
        setError("Please select a business first.")
        setLoading(false)
        return
      }

      try {
        const userId = user.id
        const safeBusinessName = selectedBusiness.replace(/[^a-zA-Z0-9]/g, "_")
        const customersCollectionRef = collection(
          db,
          `userDetails/${userId}/businesses/${safeBusinessName}/customers`
        )

        const querySnapshot = await getDocs(customersCollectionRef)
        const customers: Customer[] = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          console.log(`the customer data is ${data}`)
          return {
            id: doc.id, // Document ID
            firstName: data.firstName || "Unknown", // Ensure defaults
            lastName: data.lastName || "Unknown",
            email: data.email || "Unknown",
            phoneNumber: data.phoneNumber || "Unknown",
            createdAt: data.createdAt
              ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
              : "Unknown",
          }
        })

        setCustomers(customers)
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError("Failed to fetch customer details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [user, selectedBusiness, refreshTrigger])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const handleRefresh = () => setRefreshTrigger(!refreshTrigger) // Toggle refresh trigger

  return (
    <div className="container p-8
     mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Customers for {selectedBusiness}
      </h1>
      <DataTable
        columns={columns(handleRefresh)} // Pass the refresh function
        data={customers} // Customer data
      />
    </div>
  )
}
