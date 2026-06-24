"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileEnter, setFileEnter] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  if (status === "loading") {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(false);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(false);
    
    if (e.dataTransfer.files) {
      addFilesToList(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToList(Array.from(e.target.files));
    }
  };

  const addFilesToList = (files: File[]) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const validFiles: File[] = [];
    files.forEach((file) => {
      if (file.size > maxSize) {
        alert(`"${file.name}" exceeds the 100MB size limit and was skipped.`);
      } else {
        validFiles.push(file);
      }
    });
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`Success: ${data.message}`);
        setSelectedFiles([]);
      } else {
        setUploadStatus(`Error: ${data.message || "Failed to upload files."}`);
      }
    } catch (err) {
      console.error("upload error: ", err);
      setUploadStatus("Error: An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

    return (
    <div className="p-6 min-h-screen bg-white text-black">
      {/* Header bar */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-wider">DMS Dashboard</h1>
          <p className="text-gray-500 text-xs">Logged in: {session?.user?.email}</p>
        </div>
        <Button 
          onClick={() => signOut({ callbackUrl: "/login"})} 
          // variant="destructive"
          className="uppercase tracking-widest text-xs"
        >
          Log Out
        </Button>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Left Side: Drag and Drop Upload Zone */}
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            className={`mx-auto flex flex-col w-full h-72 border-solid items-center justify-center transition-colors cursor-pointer border-gray-300 ${
              fileEnter ? "border-4 bg-gray-100" : "border-2 bg-white hover:bg-gray-100"
            }`}
          >
            <label
              htmlFor="file"
              className="h-full w-full flex flex-col justify-center text-center cursor-pointer font-medium text-sm text-gray-600"
            >
              Click to upload or drag and drop
            </label>
            <input
              id="file"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>

        {/* Right Side: Selected Files List & Actions */}
        <div className="flex flex-col justify-between h-72">
          {selectedFiles.length > 0 ? (
            <div className="w-full flex-1 flex flex-col overflow-hidden">
                            {/* Header and Action buttons side-by-side */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                  Files Selected ({selectedFiles.length})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFiles([])}
                    disabled={uploading}
                    className="px-4 py-1.5 uppercase tracking-widest outline-none bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-1.5 uppercase tracking-widest outline-none bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>


              {/* Scrollable list of files */}
              <div className="border border-gray-200 rounded divide-y divide-gray-100 bg-white overflow-y-auto flex-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 text-xs">
                    <span className="truncate max-w-[200px] text-gray-700" title={file.name}>
                      {file.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="text-red-600 hover:text-red-800 font-semibold hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Placeholder state matching the dropzone height */
            <div className="h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-sm text-center p-6">
              No files selected.
              <br />
              Drag files or click on the left zone.
            </div>
          )}

          {/* Upload Status message */}
          {uploadStatus && (
            <div
              className={`mt-3 p-2 text-center text-xs border rounded ${
                uploadStatus.startsWith("Success")
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {uploadStatus}
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
