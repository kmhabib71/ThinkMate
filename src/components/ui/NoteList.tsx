"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NoteItem from "./NoteItem";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notes");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load notes");
        return;
      }

      setNotes(data.notes || []);
    } catch (error) {
      setError("An error occurred while fetching notes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete note");
        return;
      }

      // Remove the note from the state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      setError("An error occurred while deleting the note");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading notes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
          No Notes Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't saved any notes yet. Generate and save your first note!
        </p>
        <Link
          href="/dashboard/new"
          className="inline-block bg-green-400 text-white hover:bg-green-500 px-4 py-2 rounded transition-colors"
        >
          Create a Note
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Notes
        </h2>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
        >
          <span>New Note</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            createdAt={note.createdAt}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
