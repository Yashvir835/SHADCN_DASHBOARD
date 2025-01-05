"use client"
import { useState, useEffect } from "react" // React hooks for managing state and side effects
import { db, storage } from "@/app/firebase/firebase-config" // Firebase configuration
import { doc, setDoc, getDoc } from "firebase/firestore" // Firestore functions for database operations
import { ref, uploadBytes, getDownloadURL } from "firebase/storage" // Firebase storage functions for file uploads
import { useUser } from "@clerk/clerk-react" // Clerk hook for accessing user data
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { Loader2 } from 'lucide-react'

// Define the form schema using Zod for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  document: z.any().refine((file) => file instanceof File, "Document is required."),
  image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema> & {
  documentUrl?: string;
  imageUrl?: string;
}

// Main component for the DataDock page
const DataDockPage: React.FC = () => {
  const { user } = useUser() // Get the current Clerk user data
  const [loading, setLoading] = useState(false) // State for loading status
  const [currentStep, setCurrentStep] = useState(0) // State for the current step in the form
  const [storedData, setStoredData] = useState<FormValues | null>(null) // State for storing fetched data

  // Initialize the form with default values and validation schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      document: undefined,
      image: undefined,
    },
  })

  // Fetch user data from Firestore when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDataRef = doc(db, "userDetails", user.id)
        const docSnapshot = await getDoc(userDataRef)
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          form.reset({
            name: userData.name || "",
            location: userData.location || "",
            description: userData.description || "",
            document: undefined,
            image: undefined,
          })
          console.log("Fetched user data:", userData)
        }
      }
    }
    fetchUserData()
  }, [user, form])

  // Define the steps for the multi-step form
  const steps = [
    { id: "Step 1", name: "Basic Information", fields: ["name", "location"] },
    { id: "Step 2", name: "Additional Details", fields: ["description"] },
    { id: "Step 3", name: "Document Upload", fields: ["document", "image"] },
    { id: "Step 4", name: "Review and Submit", fields: [] },
  ]

  // Function to upload a file to Firebase Storage
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileRef = ref(storage, `${folder}/${file.name}`); // Reference to the file in Firebase Storage
    await uploadBytes(fileRef, file); // Upload the file to Firebase Storage
    const downloadURL = await getDownloadURL(fileRef); // Get the download URL of the uploaded file
    console.log(`Download URL for ${file.name}:`, downloadURL); // Log the download URL
    return downloadURL; // Return the download URL
  };

  // Function to handle form submission
  // Function to handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      alert("You must be logged in to submit data.")
      return
    }

    setLoading(true)
    try {
      const currentDate = new Date().toISOString().split("T")[0]

      // Upload document and image (if any)
      const documentUrl = await uploadFile(data.document, "documents")
      const imageUrl = data.image ? await uploadFile(data.image, "images") : ""

      const userDataRef = doc(db, "userDetails", user.id)
      const docSnapshot = await getDoc(userDataRef)

      const newData = {
        name: data.name,
        location: data.location,
        description: data.description,
        dateAdded: currentDate,
        documentUrl,
        imageUrl,
      }

      // If user data exists, update it, else create new data
      if (docSnapshot.exists()) {
        await setDoc(userDataRef, newData, { merge: true })
        alert("Details updated successfully!")
      } else {
        await setDoc(userDataRef, newData)
        alert("Details added successfully!")
      }

      // Reset the form fields after submission
      form.reset({
        name: "",
        location: "",
        description: "",
        document: undefined,
        image: undefined,
      });

      setCurrentStep(0); // Reset to the first step after successful submission
    } catch (error) {
      console.error("Error adding details:", error)
      alert("Failed to add details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // In the return statement, conditionally render stored data
  {
    currentStep === 0 && storedData && (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Stored Data</h3>
        <p><strong>Name:</strong> {storedData.name}</p>
        <p><strong>Location:</strong> {storedData.location}</p>
        <p><strong>Description:</strong> {storedData.description}</p>
        <p><strong>Document URL:</strong> <a href={storedData.documentUrl} target="_blank" rel="noopener noreferrer">{storedData.documentUrl}</a></p>
        {storedData.imageUrl && (
          <p><strong>Image URL:</strong> <a href={storedData.imageUrl} target="_blank" rel="noopener noreferrer">{storedData.imageUrl}</a></p>
        )}
      </div>
    )
  }

  // Function to fetch stored data from Firestore
  const fetchStoredData = async () => {
    if (!user) {
      alert("You must be logged in to view stored data.")
      return
    }

    setLoading(true)
    try {
      const userDataRef = doc(db, "userDetails", user.id)
      const docSnapshot = await getDoc(userDataRef)
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data() as FormValues
        setStoredData(userData)
        console.log("Fetched stored data:", userData)
      } else {
        alert("No data found for the current user.")
      }
    } catch (error) {
      console.error("Error fetching stored data:", error)
      alert("Failed to fetch stored data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Function to move to the next step
  const nextStep = async () => {
    const fields = steps[currentStep].fields
    const output = await form.trigger(fields as Array<keyof FormValues>)
    if (output && currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1)
    }
  }

  // Function to move to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Heading title="Data Dock" description="Add or update your details" />
      <Separator className="my-6" />

      {/* Progress indicator */}
      <div className="mb-8">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          {steps.map((step, index) => (
            <li key={step.id} className={`flex md:w-full items-center ${index === currentStep ? 'text-blue-600 dark:text-blue-500' : ''} ${index < currentStep ? 'text-green-600 dark:text-green-500' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                {index < currentStep ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                ) : (
                  <span className="mr-2">{index + 1}</span>
                )}
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1 */}
          {currentStep === 0 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Show the View Stored Data button only on step 0 */}
              {currentStep === 0 && (
                <Button type="button" onClick={fetchStoredData} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "View Stored Data"
                  )}
                </Button>
              )}
            </>
          )}

          {/* Step 2 */}
          {currentStep === 1 && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Step 3 */}
          {currentStep === 2 && (
            <>
              <FormField
                control={form.control}
                name="document"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <Input type="file" accept="file/*" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload Image (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 4 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <p><strong>Name:</strong> {form.getValues("name")}</p>
              <p><strong>Location:</strong> {form.getValues("location")}</p>
              <p><strong>Description:</strong> {form.getValues("description")}</p>
              <p><strong>Document:</strong> {form.getValues("document")?.name || "No document uploaded"}</p>
              <p><strong>Image:</strong> {form.getValues("image")?.name || "No image uploaded"}</p>
            </div>
          )}

          {/* Display stored data */}
          {currentStep === 0 && storedData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Stored Data</h3>
              <p><strong>Name:</strong> {storedData.name}</p>
              <p><strong>Location:</strong> {storedData.location}</p>
              <p><strong>Description:</strong> {storedData.description}</p>
              <p><strong>Document URL:</strong> <a href={storedData.documentUrl} target="_blank" rel="noopener noreferrer">{storedData.documentUrl}</a></p>
              {storedData.imageUrl && (
                <p><strong>Image URL:</strong> <a href={storedData.imageUrl} target="_blank" rel="noopener noreferrer">{storedData.imageUrl}</a></p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default DataDockPage
