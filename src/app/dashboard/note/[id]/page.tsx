"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatRelative } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  FileText,
  Tag,
  History,
  Clock,
  Edit,
  Trash,
  ArrowLeft,
} from "lucide-react";
import VersionHistory from "@/components/ui/VersionHistory";

interface Note {
  id: string;
  title: string;
  content: string;
  contentType: "plain" | "rich";
  createdAt: string;
  updatedAt: string;
}

interface NoteTag {
  id: string;
  name: string;
  color: string;
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

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [tags, setTags] = useState<NoteTag[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/notes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load note");
          return;
        }

        setNote(data.note);

        // Fetch tags
        await fetchTags();

        // Fetch attachments
        await fetchAttachments();
      } catch (error) {
        setError("An error occurred while fetching the note");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/notes/${id}/tags`);
      const data = await response.json();

      if (response.ok) {
        setTags(data.tags || []);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`/api/attachments?noteId=${id}`);
      const data = await response.json();

      if (response.ok) {
        setAttachments(data.attachments || []);
      }
    } catch (error) {
      console.error("Failed to fetch attachments:", error);
    }
  };

  const handleDelete = async () => {
    if (!note) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(`/api/notes/${note.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to delete note");
          return;
        }

        router.push("/dashboard");
      } catch (error) {
        setError("An error occurred while deleting the note");
        console.error(error);
      }
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
      return "📷";
    } else if (mimeType.includes("pdf")) {
      return "📄";
    } else {
      return "📎";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              Loading note...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto py-12 px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-400">
              Note not found.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format dates
  const formattedCreatedAt = formatRelative(
    new Date(note.createdAt),
    new Date()
  );
  const formattedUpdatedAt = formatRelative(
    new Date(note.updatedAt),
    new Date()
  );

  return (
    <div className="container mx-auto py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {note.title}
              </h1>

              <div className="flex space-x-3">
                <Link
                  href={`/dashboard/edit/${note.id}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-500 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center text-red-400 hover:text-red-500 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-gray-400 hover:text-gray-500 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back
                </Link>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Clock size={14} className="mr-1" />
              <span className="mr-3">Created: {formattedCreatedAt}</span>
              <span>Updated: {formattedUpdatedAt}</span>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-sm"
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                    }}
                  >
                    <Tag size={14} />
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2 p-6 md:p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {note.contentType === "plain" ? (
                  // Plain text - render with line breaks
                  note.content.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-gray-700 dark:text-gray-200"
                    >
                      {paragraph || <br />}
                    </p>
                  ))
                ) : (
                  // Rich text - render HTML
                  <div
                    className="text-gray-700 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                )}
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <Tabs defaultValue="attachments">
                <TabsList className="mb-6">
                  <TabsTrigger
                    value="attachments"
                    className="flex items-center"
                  >
                    <FileText size={16} className="mr-2" /> Files
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="flex items-center">
                    <History size={16} className="mr-2" /> History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="attachments">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                      Attachments
                    </h3>

                    {attachments.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No attachments for this note.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {attachments.map((attachment) => (
                          <li
                            key={attachment.id}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                          >
                            <div className="flex items-center space-x-2 overflow-hidden">
                              <span className="text-lg">
                                {getFileIcon(attachment.mimeType)}
                              </span>
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
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              View
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="versions">
                  <VersionHistory noteId={id || ""} className="mt-4" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
