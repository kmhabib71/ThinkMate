"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";

interface NoteItemProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  id,
  title,
  content,
  createdAt,
  onDelete,
}) => {
  const router = useRouter();

  // Format the date to be more readable
  const formattedDate = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true,
  });

  // Truncate content to a preview length
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleEdit = () => {
    router.push(`/dashboard/edit/${id}`);
  };

  const handleView = () => {
    router.push(`/dashboard/note/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg border border-transparent hover:border-green-200 dark:hover:border-green-900">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line line-clamp-3">
        {truncateContent(content)}
      </p>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleView}
          className="text-green-400 hover:text-green-500 text-sm font-medium transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          View
        </button>
        <button
          onClick={handleEdit}
          className="text-blue-400 hover:text-blue-500 text-sm font-medium transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteItem;
