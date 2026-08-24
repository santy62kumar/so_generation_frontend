import React, { useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, Info } from "lucide-react";

import PageLayout from "@/components/PageLayout";
import Dropzone from "@/components/ui/dropzone";
import SubmitButton from "@/components/ui/SubmitButton";
import { apiUrl } from "@/api/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/utils/downloadFile";

export default function XLSXConverter() {
  const [file,        setFile]        = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error,       setError]       = useState("");
  const [outputFiles, setOutputFiles] = useState([]);

  const acceptFile = ([f]) => {
    if (f?.name.endsWith(".xlsx")) {
      setFile(f);
      setError("");
    } else {
      setError("Please upload a valid .xlsx file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(apiUrl('/process-xlsx'), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error((await response.text()) || "File processing failed");

      const blob = await response.blob();

      setOutputFiles([{
        name: "processed_output.xlsx",
        url: window.URL.createObjectURL(blob),
        size: (blob.size / 1024).toFixed(2),
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error("Upload Error:", err);
      setError("File processing failed. Please verify the sheet format and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageLayout maxWidth="max-w-2xl">
      <div className="px-10 pt-10">
        <Dropzone
          accept=".xlsx"
          active={Boolean(file)}
          onFiles={acceptFile}
          className="mb-6"
        >
          <FileSpreadsheet
            aria-hidden="true"
            strokeWidth={1.5}
            className="mx-auto mb-4 size-12 text-brand-warm"
          />
          {file ? (
            <p className="font-semibold text-brand-dark">{file.name}</p>
          ) : (
            <>
              <p className="mb-1 font-semibold text-brand-deep">
                Drop your XLSX file here, or click to browse
              </p>
              <p className="text-sm text-brand-muted">.xlsx files only</p>
            </>
          )}
        </Dropzone>

        <SubmitButton
          loading={isUploading}
          disabled={!file}
          onClick={handleUpload}
          idleLabel="Convert & Download"
          loadingLabel="Processing your file…"
        />

        {error && (
          <Alert variant="destructive" className="mt-6 animate-shake">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* ── Output / info panel ─────────────────────────────────────── */}
      <div className="px-10 pt-6 pb-10">
        <div className="rounded-xl border border-brand-warm bg-linear-90 from-brand-blush to-brand-light p-6">
          {outputFiles.length > 0 ? (
            <div className="animate-slide-in">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-brand-dark" />
                <p className="font-semibold text-brand-dark">
                  Generated Files ({outputFiles.length})
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {outputFiles.map((f) => (
                  <li
                    key={f.url}
                    className="flex items-center justify-between gap-3 rounded-lg border border-brand-med/20 bg-white px-4 py-3.5 transition-all hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(107,75,65,0.2)]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-linear-135 from-brand-dark to-brand-deep text-white">
                        <FileSpreadsheet aria-hidden="true" className="size-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-brand-med">{f.name}</p>
                        <p className="text-xs text-brand-med">{f.size} KB</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(f.url, f.name)}
                      className="shrink-0"
                    >
                      <Download />
                      Download
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-dark" />
              <div className="text-base leading-relaxed text-brand-deep">
                <p className="mb-2 font-semibold">File Requirements</p>
                <p>Upload in XLSX format</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
