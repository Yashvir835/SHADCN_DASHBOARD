'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface BusinessContextType {
  selectedBusiness: string | null;
  setSelectedBusiness: (business: string | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  return (
    <BusinessContext.Provider value={{ selectedBusiness, setSelectedBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within a BusinessProvider");
  }
  return context;
};
