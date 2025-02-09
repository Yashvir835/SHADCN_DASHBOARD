import type React from "react"
import DocumentScanner, { type HolderInfo } from "./DocumentScanner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanned: (info: HolderInfo, imageBlob: Blob) => void
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onScanned }) => {
  const handleScanned = (blob: Blob, info?: HolderInfo) => {
    if (info) {
      onScanned(info, blob)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
        <DialogHeader>
          <DialogTitle>Scan Your Document</DialogTitle>
        </DialogHeader>
        <div className="h-[80vh]">
          <DocumentScanner onScanned={handleScanned} onStopped={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ScannerModal

