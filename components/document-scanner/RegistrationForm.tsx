import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import ScannerModal from "./ScannerModal"
import type { HolderInfo } from "./DocumentScanner"

interface FormData {
  firstName: string
  lastName: string
  docNumber: string
  birthDate: string
  sex: string
}

const RegistrationForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scannedImage, setScannedImage] = useState<string | null>(null)

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      docNumber: "",
      birthDate: "",
      sex: "",
    },
  })

  const onSubmit = (data: FormData) => {
    // Your existing submit logic here
    console.log(data)
    // Instead of redirecting, you can process the form data here
  }

  const handleScanComplete = (info: HolderInfo, imageBlob: Blob) => {
    form.setValue("firstName", info.firstName)
    form.setValue("lastName", info.lastName)
    form.setValue("docNumber", info.docNumber)
    form.setValue("birthDate", info.birthDate)
    form.setValue("sex", info.sex)
    setScannedImage(URL.createObjectURL(imageBlob))
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="docNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="button" onClick={() => setIsModalOpen(true)}>
            Scan Document
          </Button>

          {scannedImage && (
            <div>
              <img src={scannedImage || "/placeholder.svg"} alt="Scanned Document" className="mt-4 max-w-full h-auto" />
            </div>
          )}

          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <ScannerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onScanned={handleScanComplete} />
    </div>
  )
}

export default RegistrationForm

