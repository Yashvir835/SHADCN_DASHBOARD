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
  deleteObject,
  listAll,
  getMetadata
} from "firebase/storage";
import { jsPDF } from "jspdf"

export const uploadFile = async (file: File, folder: string, business: string, userId: string): Promise<string> => {
  const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, '_');
  const fileRef = ref(storage, `${userId}/${safeBusinessName}/${folder}/${file.name}`);

  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

export const uploadTextAsPDF = async (text: string, business: string, userId: string): Promise<string> => {
  const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${Date.now()}_content.pdf`;

  // Create PDF instance
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height; // Page height
  const pageWidth = doc.internal.pageSize.width - 20; // Page width with margin
  const lineSpacing = 10; // Spacing between lines
  let y = 10; // Initial Y position for text

  // Helper function to detect headings
  const isHeading = (line: string) => {
    const trimmedLine = line.trim();
    return (
      /^[A-Z ]+:$/.test(trimmedLine) || // Ends with a colon and is uppercase
      trimmedLine.toUpperCase() === trimmedLine || // Fully uppercase
      trimmedLine.length <= 25 // Short lines (titles/headings)
    );
  };

  // Split input text into lines based on newlines
  const lines = text.split("\n");

  lines.forEach((line) => {
    if (y + lineSpacing > pageHeight) {
      doc.addPage(); // Add a new page if text exceeds current page height
      y = 10; // Reset Y position for the new page
    }

    if (isHeading(line)) {
      // Format as heading
      doc.setFontSize(16); // Larger font size for headings
      doc.setFont("helvetica", "bold"); // Bold font for headings
      doc.text(line.trim(), 10, y); // Write the heading text
      y += lineSpacing + 4; // Add extra spacing after headings
    } else {
      // Format as paragraph
      doc.setFontSize(12); // Regular font size for paragraphs
      doc.setFont("helvetica", "normal"); // Normal font for paragraphs

      const paragraphLines = doc.splitTextToSize(line.trim(), pageWidth); // Split paragraph into lines
      paragraphLines.forEach((pLine) => {
        if (y + lineSpacing > pageHeight) {
          doc.addPage(); // Add new page if text exceeds page height
          y = 10;
        }
        doc.text(pLine, 10, y); // Write each line of the paragraph
        y += lineSpacing;
      });
    }
  });

  const pdfBlob = doc.output("blob");

  // Convert Blob to File
  const file = new File([pdfBlob], fileName, { type: "application/pdf" });

  return await uploadFile(file, "documents", safeBusinessName, userId);
};




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

// this function is used to add the customer to the firestore for the particular business
export async function addCustomer(
  customerData: any,
  businessName: string,
  userId: string
) {
  try {
    // Create a sanitized business name for the path
    const safeBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, "_");

    // Define the Firestore document path for the customer
    const customerRef = doc(
      db,
      `userDetails/${userId}/businesses/${safeBusinessName}/customers/${customerData.phoneNumber}`
    );

    // Add or update the customer data
    await setDoc(customerRef, {
      ...customerData,
      createdAt: new Date(), // Add timestamp
    });

    console.log("Customer added successfully!");
  } catch (error) {
    console.error("Error adding customer: ", error);
    throw new Error("Failed to add customer");
  }
}


// function to get the customers for the particular business
export async function getCustomersByBusiness(
  userId: string,
  businessName: string
): Promise<any[]> {
  try {
    // Sanitize the business name for consistent path formatting
    const safeBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, "_");

    // Define the Firestore collection path for the customers
    const customersCollectionRef = collection(
      db,
      `userDetails/${userId}/businesses/${safeBusinessName}/customers`
    );

    // Fetch all documents from the collection
    const querySnapshot = await getDocs(customersCollectionRef);

    // Map through the documents and extract data
    const customers = querySnapshot.docs.map((doc) => ({
      id: doc.id, // The document ID (e.g., phone number)
      ...doc.data(), // The actual customer data
    }));

    console.log("Fetched customers:", customers);
    return customers; // Return an array of customer details
  } catch (error) {
    console.error("Error fetching customers: ", error);
    throw new Error("Failed to fetch customer details");
  }
}


// function to delete the customer from the firestore
export const deleteCustomer = async (userId: string, businessName: string, customerId: string) => {
  const safeBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, "_") // Sanitize business name
  const customerDocRef = doc(
    db,
    `userDetails/${userId}/businesses/${safeBusinessName}/customers`, // Path to customer document
    customerId // The unique customer ID
  )

  try {
    await deleteDoc(customerDocRef) // Delete the customer document
    console.log(`Customer with ID ${customerId} deleted successfully`)
  } catch (error) {
    console.error("Error deleting customer:", error)
    throw new Error("Failed to delete customer")
  }
}


// function to fetch all documents for the particular business
interface DocumentData {
  id: string
  name: string
  url: string
  uploadDate: string
}
export const fetchDocuments = async (
  userId: string,
  selectedBusiness: string,
  storage: any
): Promise<DocumentData[]> => {
  if (!userId || !selectedBusiness) {
    throw new Error("User ID and business name are required.")
  }

  try {
    const safeBusinessName = selectedBusiness.replace(/[^a-zA-Z0-9]/g, "_")
    const folderRef = ref(storage, `${userId}/${safeBusinessName}/documents`)

    const fileList = await listAll(folderRef)
    const documentPromises = fileList.items.map(async (item, index) => {
      const metadata = await getMetadata(item)
      const url = await getDownloadURL(item)
      return {
        id: `doc${index + 1}`,
        name: item.name,
        url: url,
        uploadDate: metadata.timeCreated
          ? new Date(metadata.timeCreated).toLocaleDateString()
          : "Unknown",
      }
    })

    return await Promise.all(documentPromises)
  } catch (err) {
    console.error("Error fetching documents:", err)
    throw new Error("Failed to fetch documents.")
  }
}





// Store avatar details under "avatar" collection (document id is the avatar name)
export const addAvatar = async (
  userId: string,
  business: string,
  avatarData: {
    avatarName: string;
    image: string; // (or URL)
    voice: string; // (or URL)
    language: string;
  }
): Promise<void> => {
  if (!userId) {
    throw new Error("User is not logged in.");
  }
  const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, "_");
  const avatarRef = doc(
    db,
    `userDetails/${userId}/businesses/${safeBusinessName}/avatar`,
    avatarData.avatarName
  );
  await setDoc(avatarRef, avatarData);
};

// Fetch all avatar documents for a business
export const fetchAvatars = async (
  userId: string,
  business: string
): Promise<
  {
    avatarName: string;
    image: string;
    voice: string;
    language: string;
  }[]
> => {
  if (!userId || !business) {
    throw new Error("User ID and business name are required.");
  }
  const safeBusinessName = business.replace(/[^a-zA-Z0-9]/g, "_");
  const avatarsCol = collection(
    db,
    `userDetails/${userId}/businesses/${safeBusinessName}/avatar`
  );
  const querySnapshot = await getDocs(avatarsCol);
  const avatars = querySnapshot.docs.map((doc) => doc.data()) as {
    avatarName: string;
    image: string;
    voice: string;
    language: string;
  }[];
  return avatars;
};