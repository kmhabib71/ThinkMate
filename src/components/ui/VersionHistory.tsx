"use client";

import React, { useState, useEffect } from "react";
import { Clock, RotateCcw, Check, X } from "lucide-react";

interface Version {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  comment: string;
}

interface VersionHistoryProps {
  noteId: string;
  onRestore?: (versionId: string) => void;
  className?: string;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  noteId,
  onRestore,
  className = "",
}) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const fetchVersions = async () => {
    if (!noteId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${noteId}/versions`);
      const data = await response.json();

      if (response.ok) {
        setVersions(data.versions || []);
      } else {
        setError(data.error || "Failed to load version history");
        console.error("Error loading versions:", data.error);
      }
    } catch (error) {
      setError("An error occurred while loading version history");
      console.error("Version fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchVersions();
    }
  }, [noteId]);

  const handleRestore = async (versionId: string) => {
    setConfirmation(null);
    setRestoring(true);

    try {
      const response = await fetch(
        `/api/notes/${noteId}/versions/${versionId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        if (onRestore) {
          onRestore(versionId);
        }
      } else {
        const data = await response.json();
        setError(data.error || "Failed to restore version");
      }
    } catch (error) {
      setError("An error occurred while restoring the version");
      console.error("Restore error:", error);
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  if (loading && versions.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Loading version history...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
        Version History
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {versions.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No previous versions found
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-gray-800 dark:text-gray-200">
                    <span className="font-medium">
                      Version {version.versionNumber}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatDate(version.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {version.comment}
                  </p>
                </div>

                {onRestore && (
                  <div>
                    {confirmation === version.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleRestore(version.id)}
                          className="p-1 text-green-500 hover:text-green-600"
                          disabled={restoring}
                          title="Confirm restore"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmation(null)}
                          className="p-1 text-red-500 hover:text-red-600"
                          disabled={restoring}
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmation(version.id)}
                        className="p-1 text-blue-500 hover:text-blue-600"
                        disabled={restoring}
                        title="Restore this version"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
