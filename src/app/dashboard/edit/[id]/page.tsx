"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      } catch (error) {
        setError("An error occurred while fetching the note");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

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

      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update note");
        return;
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Note
          </h1>

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
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                rows={15}
                placeholder="Note content..."
              />
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
                className="w-24"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
