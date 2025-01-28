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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

import { MapContainer as LeafletMapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  business: z.string().min(2, "Business name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  location: z.string().optional(), // User-entered location
  latitude: z.string().optional(), // Latitude (as string to match Zod requirement)
  longitude: z.string().optional(), // Longitude (as string to match Zod requirement)
});


type FormValues = z.infer<typeof formSchema> & {
  documentUrl?: string;
  imageUrl?: string;
}

const AddBusiness: React.FC = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [storedData, setStoredData] = useState<FormValues | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertDialogContent, setAlertDialogContent] = useState({ title: "", description: "" })
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default map center
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business: "",
      description: "",
      location: "",
      latitude: "",
      longitude: "",
    },
  });


  const steps = [
    { id: "Step 1", name: "Basic Information", fields: ["name", "business"] },
    { id: "Step 2", name: "Additional Details", fields: ["description"] },
    { id: "Step 3", name: "Location Information", fields: ["location", "latitude", "longitude"] }, // Updated
    { id: "Step 4", name: "Review and Submit", fields: [] },
  ]



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




      // Reference to the user's businesses subcollection
      const businessRef = doc(db, `userDetails/${user.id}/businesses`, safeBusinessName);
      const businessSnapshot = await getDoc(businessRef);

      const newBusinessData = {
        name: data.name,
        business: data.business,
        description: data.description,
        location: data.location,   // User-entered location
        latitude: data.latitude,   // Latitude of the selected location
        longitude: data.longitude, // Longitude of the selected location
        dateAdded: currentDate,
      };

      // Add or update the business 
      if (businessSnapshot.exists()) {
        // Merge with existing data for the specific business
        await setDoc(businessRef, newBusinessData, { merge: true });
        showAlert("Success", "Business details updated successfully!");
      } else {
        // Create a new business for the user
        await setDoc(businessRef, newBusinessData);
        showAlert("Success", "New business added successfully!");
      }

      // Reset form after submission
      form.reset({
        name: "",
        business: "",
        description: "",
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
    if (output && currentStep < steps.length) {
      setCurrentStep((step) => step + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }
  const ChangeMapView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 13);
    }, [center, map]);
    return null;
  };
  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });


  //  this is Custom component to handle map click events
  const MapClickHandler = () => {
    const [address, setAddress] = useState<string>("");

    useMapEvents({
      click: async (event: L.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;

        // Set marker and position
        setMarkerPosition([lat, lng]);
        setPosition([lat, lng]);

        // Update form values for latitude and longitude
        form.setValue("latitude", lat.toString());
        form.setValue("longitude", lng.toString());

        // Reverse Geocoding: Fetch address from the lat/lng
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await response.json();

          if (data && data.display_name) {
            setAddress(data.display_name); // Update address state
            form.setValue("location", data.display_name); // Optional: Update address in the form
          } else {
            setAddress("Address not found");
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setAddress("Error fetching address");
        }
      },
    });

    return null; // This component doesn't render anything
  };


  const searchLocation = async () => {
    const location = form.getValues("location");
    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon } = results[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setMarkerPosition(newCenter);
        form.setValue("latitude", lat);
        form.setValue("longitude", lon);
      } else {
        showAlert("Error", "Couldn't find the location. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      showAlert("Error", "Failed to search for location. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* CHANGE: Adjusted text sizes for better responsiveness */}
      <Heading
        title="Add New Business"
        description="Add or update your details"
      />
      <Separator className="my-6" />

      {/* CHANGE: Made the steps more responsive */}
      {/*  in this div we can add overflow-x-auto to make the heading scrollable */}
      <div className="mb-8 ">
        <ol className="flex items-center w-full min-w-max text-xs md:text-md md:text-base font-medium text-center text-gray-500 dark:text-gray-400">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`flex items-center ${index === currentStep ? "text-blue-600 dark:text-blue-500" : ""} ${index < currentStep ? "text-green-600 dark:text-green-500" : ""} after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden md:after:inline-block after:mx-2 md:after:mx-4 xl:after:mx-6 dark:after:border-gray-700`}
            >
              <span className="flex items-center after:content-['/'] md:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                {index < currentStep ? (
                  <svg
                    className="w-3 h-3 md:w-3.5 md:h-3.5 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                ) : (
                  <span className="mr-2">{index + 1} Step</span>
                )}
                {/* CHANGE: Hide step names on mdaller screens */}
                <span className="hidden md:inline">{step.name}</span>
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
                      <Input placeholder="Yashvir Malik" {...field} />
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
                      <Input placeholder="Nexus Beings" {...field} />
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
                    <Textarea placeholder="Tell us about yourself..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Location</FormLabel>
                    <FormControl>
                      {/* CHANGE: Made the search input and button stack on mdaller screens */}
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                        <Input placeholder="Enter address" {...field} className="w-full md:w-auto" />
                        <Button type="button" onClick={searchLocation} className="w-full md:w-auto">
                          Search
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CHANGE: Adjusted map height for better responsiveness */}
              <div className="h-64 md:h-96 mt-4 relative z-0 overflow-hidden">
                <LeafletMapContainer
                  center={mapCenter as L.LatLngExpression}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}

                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {markerPosition && <Marker position={markerPosition as L.LatLngExpression} icon={customIcon} />}
                  <MapClickHandler /> {/* Handles map clicks */}

                  <ChangeMapView center={mapCenter} />
                </LeafletMapContainer>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <p>
                <strong>Name:</strong> {form.getValues("name")}
              </p>
              <p>
                <strong>Business:</strong> {form.getValues("business")}
              </p>
              <p>
                <strong>Description:</strong> {form.getValues("description")}
              </p>
              <p>
                <strong>Location:</strong> {form.getValues("location")}
              </p>

            </div>
          )}

          {/* CHANGE: Made buttons stack on mdaller screens */}
          <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="w-full md:w-auto"
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={nextStep} className="w-full md:w-auto">
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
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
            <AlertDialogDescription>{alertDialogContent.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {alertDialogContent.title === "Error" ? <span>Ok</span> : <Link href="/">Go to Dashboard</Link>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AddBusiness

