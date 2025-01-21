import { db, storage } from "@/app/firebase/firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,

} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { jsPDF } from "jspdf"

export const uploadFile = async (file: File, folder: string, business: string, userId: string): Promise<string> => {
  const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, '_');
  const fileRef = ref(storage, `${userId}/${safeBusinessName}/${folder}/${file.name}`);

  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

// this function create text into pdf and upload into the firebase
export const uploadTextAsPDF = async (text: string, business: string, userId: string): Promise<string> => {
  const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, "_")
  const fileName = `${Date.now()}_content.pdf`

  // Create PDF from text
  const doc = new jsPDF()
  doc.text(text, 10, 10)
  const pdfBlob = doc.output("blob")

  // Convert Blob to File
  const file = new File([pdfBlob], fileName, { type: "application/pdf" })

  return await uploadFile(file, "documents", safeBusinessName, userId)
}

// Main function to add or update business data
export const addOrUpdateBusiness = async (
  userId: string,
  data: {
    name: string
    business: string
    description: string
    documents?: File[]
    websiteUrl?: string
    textContent?: string
  },
): Promise<{ success: boolean; message: string; isNew: boolean }> => {
  if (!userId) {
    throw new Error("User is not logged in.")
  }

  const currentDate = new Date().toISOString().split("T")[0]
  const safeBusinessName = data.business.replace(/[^a-zA-Z0-9]/g, "_")

  let documentUrls: string[] = []

  // Upload documents if provided
  if (data.documents && data.documents.length > 0) {
    documentUrls = await Promise.all(
      data.documents.map((doc) => uploadFile(doc, "documents", safeBusinessName, userId)),
    )
  }

  // Convert and upload text content if provided
  if (data.textContent) {
    const textDocumentUrl = await uploadTextAsPDF(data.textContent, safeBusinessName, userId)
    documentUrls.push(textDocumentUrl)
  }

  const businessRef = doc(db, `userDetails/${userId}/businesses`, safeBusinessName)
  const businessSnapshot = await getDoc(businessRef)

  const newBusinessData = {
    name: data.name,
    business: data.business,
    description: data.description,
    dateUpdated: currentDate,
    documentUrls,
    websiteUrl: data.websiteUrl || null,
  }

  if (businessSnapshot.exists()) {
    await setDoc(businessRef, newBusinessData, { merge: true })
    return { success: true, message: "Business details and files updated successfully!", isNew: false }
  } else {
    await setDoc(businessRef, newBusinessData)
    return { success: true, message: "New business and files added successfully!", isNew: true }
  }
}



export const fetchBusinessDetails = async (userId: string, businessName: string): Promise<any> => {
  if (!userId) {
    throw new Error("User is not logged in.");
  }

  const safeBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_');
  const businessRef = doc(db, `userDetails/${userId}/businesses`, safeBusinessName);
  const businessSnapshot = await getDoc(businessRef);

  if (businessSnapshot.exists()) {
    return businessSnapshot.data();
  } else {
    throw new Error("Business not found");
  }
};

/**
 * Fetches all business names associated with a specific user.
 * @returns An array of business names.
 */
export const fetchBusinesses = async (userId: string): Promise<string[]> => {
  if (!userId) {
    throw new Error("User is not logged in.");
  }

  try {
    // Reference to the businesses subcollection
    const businessesCol = collection(db, `userDetails/${userId}/businesses`);

    // Fetch all documents from the subcollection
    const businessSnapshots = await getDocs(businessesCol);

    // Extract the 'business' field from each document
    const businessNames = businessSnapshots.docs.map((doc) => {
      const data = doc.data();
      return data.business; // Use the 'business' field from the document data
    });

    return businessNames;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("Failed to fetch business names.");
  }
};



// this is for deleting the document and used in the knowledge base page
export const deleteDocument = async (userId: string, businessName: string, fileName: string) => {
  const safeBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_')
  const fileRef = ref(storage, `${userId}/${safeBusinessName}/documents/${fileName}`)

  try {
    await deleteObject(fileRef)
    console.log(`Document ${fileName} deleted successfully`)
  } catch (error) {
    console.error("Error deleting document:", error)
    throw new Error("Failed to delete document")
  }
}
