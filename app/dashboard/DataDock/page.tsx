"use client"
import { useState, useEffect } from "react"
import { db, storage } from "@/app/firebase/firebase-config"
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useUser } from "@clerk/clerk-react"
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
import { StoreData } from "@/lib/StoreData"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  business: z.string().min(2, "Business name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  document: z.any().refine((file) => file instanceof File, "Document is required."),
  image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema> & {
  documentUrl?: string;
  imageUrl?: string;
}

const DataDockPage: React.FC = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [storedData, setStoredData] = useState<FormValues | null>(null)
  const [businessToView, setBusinessToView] = useState("")
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertDialogContent, setAlertDialogContent] = useState({ title: "", description: "" })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business: "",
      description: "",
      document: undefined,
      image: undefined,
    },
  })

  const steps = [
    { id: "Step 1", name: "Basic Information", fields: ["name", "business"] },
    { id: "Step 2", name: "Additional Details", fields: ["description"] },
    { id: "Step 3", name: "Document Upload", fields: ["document", "image"] },
    { id: "Step 4", name: "Review and Submit", fields: [] },
  ]

  const uploadFile = async (file: File, folder: string, business: string, userId: string): Promise<string> => {
    const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize business name
    const fileRef = ref(storage, `${userId}/${safeBusinessName}/${folder}/${file.name}`); // Path: user.id/businessName/folder/file.name

    // Upload file
    await uploadBytes(fileRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const showAlert = (title: string, description: string) => {
    setAlertDialogContent({ title, description });
    setAlertDialogOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      showAlert("Error", "You must be logged in to submit data.");
      return;
    }

    setLoading(true);

    try {
      const currentDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
      const safeBusinessName = data.business.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize business name

      // Upload document
      const documentUrl = await uploadFile(data.document, "documents", safeBusinessName, user.id);

      // Upload image (if exists)
      const imageUrl = data.image
        ? await uploadFile(data.image, "images", safeBusinessName, user.id)
        : "";

      // Reference to the user's businesses subcollection
      const businessRef = doc(db, `userDetails/${user.id}/businesses`, safeBusinessName);
      const businessSnapshot = await getDoc(businessRef);

      // New data object for the business
      const newBusinessData = {
        name: data.name,                // User's name
        business: data.business,        // Business name entered by the user
        description: data.description,  // Business description
        dateAdded: currentDate,         // The current date (in YYYY-MM-DD format)
        documentUrl,                    // URL of the uploaded document
        imageUrl,                       // URL of the uploaded image (if any)
      };

      // Add or update the business document
      if (businessSnapshot.exists()) {
        // Merge with existing data for the specific business
        await setDoc(businessRef, newBusinessData, { merge: true });
        showAlert("Success", "Business details updated successfully!");
        StoreData(safeBusinessName)
      } else {
        // Create a new document for the business
        await setDoc(businessRef, newBusinessData);
        showAlert("Success", "New business added successfully!");
        StoreData(safeBusinessName)
      }

      // Reset form after submission
      form.reset({
        name: "",
        business: "",
        description: "",
        document: undefined,
        image: undefined,
      });

      setCurrentStep(0); // Reset step to the beginning
    } catch (error) {
      console.error("Error adding details:", error);
      showAlert("Error", "Failed to add details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields
    const output = await form.trigger(fields as Array<keyof FormValues>)
    if (output && currentStep < steps.length ) {
      setCurrentStep((step) => step + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Heading title="Data Dock" description="Add or update your details" />
      <Separator className="my-6" />

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
                name="business"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business</FormLabel>
                    <FormControl>
                      <Input placeholder="My Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {currentStep === 1 && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {currentStep === 2 && (
            <>
              <FormField
                control={form.control}
                name="document"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...rest}
                      />
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
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <p><strong>Name:</strong> {form.getValues("name")}</p>
              <p><strong>Business:</strong> {form.getValues("business")}</p>
              <p><strong>Description:</strong> {form.getValues("description")}</p>
              <p><strong>Document:</strong> {form.getValues("document")?.name || "No document uploaded"}</p>
              <p><strong>Image:</strong> {form.getValues("image")?.name || "No image uploaded"}</p>
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
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            )}
            {currentStep == 3 && (
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

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DataDockPage

