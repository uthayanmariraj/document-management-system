"use client";

import Link from 'next/link'
import { useState, useEffect } from "react"
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface UserFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  downloadUrl?: string;
}

export default function Dashboard(){
  const { data: session } = useSession();
  const [files, setFiles] = useState<UserFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const showFiles = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/files")
      const data = await response.json()
      if (response.ok) {
        setFiles(data.files)
      } else {
        setError(data.message || "Failed to load files.");
      }
    } catch(err) {
       setError("Failed to load files. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    showFiles()
  }, [])

  return (
    <div className="p-6 min-h-screen bg-white text-black">
      {/* Header bar */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-wider">DMS Dashboard</h1>
          <p className="text-gray-500 text-xs">Logged in: {session?.user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/upload">
            <Button variant="outline" className="uppercase tracking-widest text-xs">
              Upload Page
            </Button>
          </Link>
          <Button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="uppercase tracking-widest text-xs"
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">
          Your Documents
        </h2>

        {loading && (
          <div className="text-center py-6 text-sm text-gray-500">
            Loading your files...
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 text-center text-xs bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {!loading && !error && files.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded text-center py-12 text-gray-400 text-sm">
            No files to display.
            <br />
            <Link href="/upload" className="text-teal-600 hover:text-teal-800 font-semibold underline mt-2 inline-block">
              Upload your first file
            </Link>
          </div>
        ) : (
          !loading && !error && (
            <div className="border border-gray-200 rounded divide-y divide-gray-100 bg-white shadow-sm">
              {files.map((file) => (
                <div key={file.id} className="flex justify-between items-center p-3 text-xs hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="truncate max-w-[250px] sm:max-w-md font-semibold text-gray-700" title={file.originalName}>
                      {file.originalName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <a 
                      href={file.downloadUrl}
                      download={file.originalName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 uppercase tracking-widest bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] font-bold transition-all text-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}