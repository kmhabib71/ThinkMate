"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatRelative } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
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
      } catch (error) {
        setError("An error occurred while fetching the note");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-6 flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {note.title}
            </h1>

            <div className="flex space-x-2">
              <Link
                href={`/dashboard/edit/${note.id}`}
                className="inline-flex items-center text-blue-400 hover:text-blue-500 text-sm font-medium transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <p>Created: {formattedCreatedAt}</p>
            <p>Updated: {formattedUpdatedAt}</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {note.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-200">
                {paragraph || <br />}
              </p>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link
              href="/dashboard"
              className="text-green-400 hover:text-green-500 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
