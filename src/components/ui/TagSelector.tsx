"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tag, X, Plus, Check } from "lucide-react";

interface TagOption {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [isCreating, setIsCreating] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tags");
      const data = await response.json();

      if (response.ok) {
        setTags(data.tags || []);
      } else {
        setError(data.error || "Failed to load tags");
        console.error("Error loading tags:", data.error);
      }
    } catch (error) {
      setError("An error occurred while loading tags");
      console.error("Tag fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    onChange(newSelectedTags);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: newTagColor,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new tag to the list
        setTags((prev) => [...prev, data.tag]);

        // Select the new tag
        onChange([...selectedTags, data.tag.id]);

        // Clear the input
        setNewTagName("");
        setNewTagColor("#3b82f6");
        setIsCreating(false);
      } else {
        setError(data.error || "Failed to create tag");
      }
    } catch (error) {
      setError("An error occurred while creating the tag");
      console.error("Tag creation error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedTagNames = () => {
    return selectedTags
      .map((id) => tags.find((tag) => tag.id === id)?.name)
      .filter(Boolean);
  };

  const getTagById = (id: string) => {
    return tags.find((tag) => tag.id === id);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex flex-wrap gap-2 min-h-[38px] p-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-slate-700"
        onClick={() => setIsOpen(true)}
      >
        {selectedTags.length > 0 ? (
          selectedTags.map((tagId) => {
            const tag = getTagById(tagId);
            if (!tag) return null;

            return (
              <div
                key={tag.id}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-sm"
                style={{ backgroundColor: tag.color + "20", color: tag.color }}
              >
                <Tag size={14} />
                <span>{tag.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleTag(tag.id);
                  }}
                  className="ml-1 hover:opacity-80"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm px-2 py-1">
            Select tags...
          </div>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
        >
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {error && (
            <div className="px-3 py-2 text-red-500 text-sm">{error}</div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                Loading tags...
              </div>
            ) : filteredTags.length > 0 ? (
              <div className="p-2 space-y-1">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedTags.includes(tag.id)
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleToggleTag(tag.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    {selectedTags.includes(tag.id) && (
                      <div className="text-green-500">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No tags found
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Create a new tag
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600"
              />
              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || isCreating}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
