"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UpdateSchemaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  async function handleUpdateSchema() {
    try {
      setUpdating(true);
      setResult(null);
      setError(null);

      const response = await fetch("/api/admin/update-schema", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred while updating the schema.");
        return;
      }

      setResult("Schema updated successfully! Now try saving a note again.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Update Database Schema</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            This utility will update the database schema to fix any issues with
            saving notes. Only use this if you're experiencing problems with the
            note-saving functionality.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700 mb-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700 mb-4">
              <p className="text-green-600 dark:text-green-400">{result}</p>
            </div>
          )}

          <button
            onClick={handleUpdateSchema}
            disabled={updating}
            className={`px-4 py-2 rounded bg-green-400 text-white hover:bg-green-500 transition-colors ${
              updating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updating ? "Updating..." : "Update Schema"}
          </button>
        </div>
      </div>
    </div>
  );
}
