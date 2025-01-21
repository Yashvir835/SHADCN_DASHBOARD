'use client'

import { useState } from "react"
import { useBusinessContext } from "@/app/context/BusinessContext"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { Loader2, Upload, X } from 'lucide-react'
import { addOrUpdateBusiness } from "@/lib/firebase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { handler } from "@/lib/UpsertVectorHandler"

// Define the form schema using zod
const formSchema = z.object({
  documents: z.array(z.instanceof(File)).min(1, "Please upload at least one document"), // Required, with at least one file
  textContent: z.string().min(1, "Please give some input").optional(), // Optional, but if provided, it should be a non-empty string
  websiteUrl: z.string().url("Please enter a valid URL").optional(), // Optional URL
}).refine(data => (data.documents && data.documents.length > 0) || data.textContent, {
  message: "Either upload a document or enter text content",
});

type FormValues = z.infer<typeof formSchema>

export default function UploadDocument() {
  const { selectedBusiness } = useBusinessContext()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertDialogContent, setAlertDialogContent] = useState({ title: "", description: "" })
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload")

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documents: [],
      textContent: "",
      websiteUrl: "",
    },
  })

  // Function to show alert dialog
  const showAlert = (title: string, description: string) => {
    setAlertDialogContent({ title, description })
    setAlertDialogOpen(true)
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      showAlert("Error", "You must be logged in to upload files.")
      return
    }

    if (!selectedBusiness) {
      showAlert("Error", "Please select a business first!")
      return
    }

    setLoading(true)

    try {
      const result = await addOrUpdateBusiness(
        user.id,
        {
          name: selectedBusiness,
          business: selectedBusiness,
          description: "Document Upload",
          documents: data.documents,
          websiteUrl: data.websiteUrl,
          textContent: data.textContent,
        }
      )

      if (result.success) {
        showAlert("Upload Successful", `Successfully processed content for ${selectedBusiness}.`)
        form.reset()
      } else {
        throw new Error("Failed to process content")
      }
    } catch (error) {
      console.error("Upload error:", error)
      showAlert("Upload Failed", "Failed to process content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    form.setValue("documents", files)
  }

  // Remove a file from the form
  const removeFile = (index: number) => {
    const currentFiles = form.getValues("documents") || []
    form.setValue(
      "documents",
      currentFiles.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Heading title="Upload Content" description={`Add business details for ${selectedBusiness || 'your business'}`} />
      <Separator className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Tabs for switching between document upload and text input */}
          <Tabs defaultValue="upload" onValueChange={(value) => setActiveTab(value as "upload" | "text")} className="w-full " // Center tabs and limit width
>
            <TabsList className="h-12 p-1 bg-muted/20 rounded-full mx-auto">
              <TabsTrigger value="upload" className="rounded-full px-8 text-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Upload Document</TabsTrigger>
              <TabsTrigger value="text" className="rounded-full px-8 text-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >Enter Text</TabsTrigger>
            </TabsList>

            {/* Document upload tab */}
            <TabsContent value="upload" className="w-full" >
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Documents</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        disabled={loading || !selectedBusiness}
                        accept=".pdf,.doc,.txt"
                        multiple
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && field.value.length > 0 && (
                      <div className="mt-2">
                        <ul className="mt-1 space-y-1">
                          {field.value.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm">
                              <span>{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Text input tab */}
            <TabsContent value="text">
              <FormField
                control={form.control}
                name="textContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your content here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          {/* Website URL input */}
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Alert dialog for showing messages */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setAlertDialogOpen(false)
                if (selectedBusiness) {
                  handler(selectedBusiness)
                }
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
