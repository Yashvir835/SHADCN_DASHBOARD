"use client";
import { prepare } from "@/actions/prepare";
import PDFFileUpload, { FileProps } from "@/app/MyComponents/PDFFileUploader";
import { Button } from "@/components/ui/button";
import { PDFSource } from "@/lib/pdf-loader";

import { Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<FileProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  async function submit() {
    try {
      setLoading(true);
      setLoadingMsg("Initializing Client and creating index...");

      const pdfSource: PDFSource = {
        type: "url",
        source: file?.url ?? "",
      };
      await prepare(pdfSource);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setLoadingMsg("");
      console.log(error);
    }
  }
  return (
    <div>
      <div className="flex flex-1 py-16">
        <div className="w-full max-w-2xl mx-auto">
          {file ? (
            <>
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  {loadingMsg}
                </Button>
              ) : (
                <Button onClick={() => submit()}>Upload to Pine cone</Button>
              )}
            </>
          ) : (
            <PDFFileUpload
              label="Add Files"
              file={file}
              setFile={setFile}
              endpoint="pdfUpload"
            />
          )}
        </div>
      </div>
    </div>
  );
}
