"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import FileUploader from "@/components/ui/FileUploader";
import TagSelector from "@/components/ui/TagSelector";
import VersionHistory from "@/components/ui/VersionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Save, History, Tag as TagIcon, Paperclip } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  contentType: "plain" | "rich";
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

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"plain" | "rich">("plain");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createVersion, setCreateVersion] = useState(false);
  const [versionComment, setVersionComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        setTitle(data.note.title);
        setContent(data.note.content);
        setContentType(data.note.contentType || "plain");

        // Fetch tags for this note
        fetchNoteTags();
      } catch (error) {
        setError("An error occurred while fetching the note");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const fetchNoteTags = async () => {
    try {
      const response = await fetch(`/api/notes/${id}/tags`);
      const data = await response.json();

      if (response.ok) {
        setSelectedTags(data.tags.map((tag: any) => tag.id) || []);
      }
    } catch (error) {
      console.error("Failed to fetch note tags:", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    try {
      setSaving(true);
      setSuccessMessage(null);
      setError(null);

      // Save the note
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          contentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update note");
        return;
      }

      // Save tags
      await fetch(`/api/notes/${id}/tags`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: selectedTags,
        }),
      });

      // Create a version if requested
      if (createVersion) {
        await fetch(`/api/notes/${id}/versions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            comment: versionComment || "Version saved",
          }),
        });

        setCreateVersion(false);
        setVersionComment("");
      }

      setSuccessMessage("Note updated successfully!");
      // Update the note state with the updated data
      setNote(data.note);
    } catch (error) {
      setError("An error occurred while saving the note");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleVersionRestore = (versionId: string) => {
    // After restoring a version, reload the note to show the updated content
    const fetchUpdatedNote = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/notes/${id}`);
        const data = await response.json();

        if (response.ok) {
          setNote(data.note);
          setTitle(data.note.title);
          setContent(data.note.content);
          setContentType(data.note.contentType || "plain");
          setSuccessMessage("Version restored successfully!");
        } else {
          setError("Failed to load the restored note");
        }
      } catch (error) {
        setError("An error occurred while loading the restored note");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedNote();
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

  if (error && !note) {
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

  return (
    <div className="container mx-auto py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Note
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2 p-6 md:p-8">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Note Title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Content
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="plain"
                        name="contentType"
                        value="plain"
                        checked={contentType === "plain"}
                        onChange={() => setContentType("plain")}
                        className="mr-2"
                      />
                      <label htmlFor="plain" className="text-sm">
                        Plain Text
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="rich"
                        name="contentType"
                        value="rich"
                        checked={contentType === "rich"}
                        onChange={() => setContentType("rich")}
                        className="mr-2"
                      />
                      <label htmlFor="rich" className="text-sm">
                        Rich Text
                      </label>
                    </div>
                  </div>

                  {contentType === "plain" ? (
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      rows={15}
                      placeholder="Note content..."
                    />
                  ) : (
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Start writing rich content..."
                    />
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={createVersion}
                      onChange={(e) => setCreateVersion(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Save as a new version</span>
                  </label>

                  {createVersion && (
                    <div>
                      <input
                        type="text"
                        value={versionComment}
                        onChange={(e) => setVersionComment(e.target.value)}
                        placeholder="Version comment (optional)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {successMessage}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-2">
                  <Link
                    href={`/dashboard/note/${id}`}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-md transition-colors"
                  >
                    Cancel
                  </Link>
                  <Button
                    type="submit"
                    disabled={saving || !content.trim()}
                    variant="primary"
                    className="w-24 flex items-center justify-center"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={16} className="mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <Tabs defaultValue="tags">
                <TabsList className="mb-6">
                  <TabsTrigger value="tags" className="flex items-center">
                    <TagIcon size={16} className="mr-2" /> Tags
                  </TabsTrigger>
                  <TabsTrigger
                    value="attachments"
                    className="flex items-center"
                  >
                    <Paperclip size={16} className="mr-2" /> Files
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="flex items-center">
                    <History size={16} className="mr-2" /> History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tags">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                      Tags
                    </h3>
                    <TagSelector
                      selectedTags={selectedTags}
                      onChange={setSelectedTags}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="attachments">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                      File Attachments
                    </h3>
                    <FileUploader noteId={id || ""} />
                  </div>
                </TabsContent>

                <TabsContent value="versions">
                  <VersionHistory
                    noteId={id || ""}
                    onRestore={handleVersionRestore}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
