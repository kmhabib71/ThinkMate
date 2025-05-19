"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, FileText, Image, File, Trash2 } from "lucide-react";

interface FileUploaderProps {
  noteId: string;
  onUploadComplete?: (attachments: Attachment[]) => void;
}

interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  noteId,
  onUploadComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadExistingAttachments = async () => {
    try {
      const response = await fetch(`/api/attachments?noteId=${noteId}`);
      const data = await response.json();

      if (response.ok) {
        setAttachments(data.attachments || []);
      } else {
        console.error("Failed to load attachments:", data.error);
      }
    } catch (error) {
      console.error("Error loading attachments:", error);
    }
  };

  React.useEffect(() => {
    if (noteId) {
      loadExistingAttachments();
    }
  }, [noteId]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);

    // Create a FormData object
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Simulate progress (in a real app, you'd use an upload progress event)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 100);

      // Upload the files
      const response = await fetch(`/api/attachments?noteId=${noteId}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (response.ok) {
        // Add the uploaded attachments to the list
        const newAttachments = data.attachments || [];
        setAttachments((prev) => [...prev, ...newAttachments]);

        // Call the callback if provided
        if (onUploadComplete) {
          onUploadComplete(newAttachments);
        }
      } else {
        setError(data.error || "Failed to upload files");
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      setError("An error occurred during upload. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/attachments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the attachment from the list
        setAttachments((prev) =>
          prev.filter((attachment) => attachment.id !== id)
        );
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete file");
      }
    } catch (error) {
      setError("An error occurred while deleting the file");
      console.error("Delete error:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image size={20} className="text-blue-500" />;
    } else if (mimeType.includes("pdf")) {
      return <FileText size={20} className="text-red-500" />;
    } else {
      return <File size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileInputChange}
        />
        <UploadCloud className="h-10 w-10 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Max file size: 10MB. Supported formats: images, PDFs, documents
        </p>
      </div>

      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachments ({attachments.length})
          </h3>
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {getFileIcon(attachment.mimeType)}
                  <span
                    className="text-sm truncate"
                    title={attachment.originalName}
                  >
                    {attachment.originalName}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(attachment.size)})
                  </span>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    title="View file"
                  >
                    <FileText size={16} />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(attachment.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
