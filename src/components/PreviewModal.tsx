"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    url: string;
    mimeType: string;
    originalName: string;
  } | null;
}

export function PreviewModal({ isOpen, onClose, file }: PreviewModalProps) {

    useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
            <span className="font-semibold text-sm text-gray-800 truncate" title={file.originalName}>
                Preview: {file.originalName}
            </span>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors outline-none cursor-pointer flex items-center justify-center"
                title="Close preview (Esc)"
                >
                <X size={22} />
            </button>

            </div>

            <div className="flex-1 overflow-hidden p-6 flex justify-center items-center bg-gray-100/50">
            
            {file.mimeType.startsWith("image/") && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                src={file.url} 
                alt={file.originalName} 
                className="max-h-full max-w-full object-contain rounded-sm shadow-sm"
                />
            )}

            {file.mimeType.startsWith("video/") && (
                <video 
                src={file.url} 
                controls 
                className="max-h-full max-w-full rounded-sm"
                autoPlay
                />
            )}

            {file.mimeType === "application/pdf" && (
                <iframe 
                src={file.url} 
                className="w-full h-full border border-gray-200 rounded-sm shadow-inner" 
                />
            )}

            {(file.mimeType.startsWith("text/") || file.mimeType === "application/json") && (
                <TextPreviewer url={file.url} />
            )}

            </div>
        </div>
        </div>
    );
    }
    //for raw txt files
    function TextPreviewer({ url }: { url: string }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(url)
        .then((res) => res.text())
        .then((data) => {
            setText(data);
            setLoading(false);
        })
        .catch(() => {
            setText("Failed to load file contents.");
            setLoading(false);
        });
    }, [url]);

    if (loading) return <div className="text-xs text-gray-500 font-medium">Loading text contents...</div>;
    return (
        <pre className="text-left w-full h-full overflow-auto bg-white text-gray-800 p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap rounded border border-gray-200 shadow-inner">
        {text}
        </pre>
    );
    }
