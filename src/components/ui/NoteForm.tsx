"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { GenerateNoteResponse } from "@/lib/openai";

interface NoteFormProps {
  className?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({ className }) => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/generate-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An unknown error occurred");
        setGeneratedText("");
        return;
      }

      if (data.content) {
        setGeneratedText(data.content);
      } else {
        setError("No content generated");
        setGeneratedText("");
      }
    } catch (e) {
      setError("Failed to generate text. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedText.trim()) {
      setError("No content to save");
      return;
    }

    setSaveLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const title =
        prompt.length > 50
          ? prompt.substring(0, 50) + "..."
          : prompt || "Untitled Note";

      console.log("Saving note with title:", title);

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: generatedText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to save note:", data);
        setError(data.error || "Failed to save note. Please try again.");
        return;
      }

      setSaveSuccess(true);
      console.log("Note saved successfully:", data.note);
    } catch (e) {
      console.error("Error saving note:", e);
      let errorMessage = "Failed to save note. Please try again later.";
      if (e instanceof Error) {
        errorMessage += " Error: " + e.message;
      }
      setError(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-lg shadow-md p-6",
        className
      )}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        AI Note Generator
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt for your AI-generated note..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            rows={3}
            aria-describedby={error ? "prompt-error" : undefined}
          />
          {error && (
            <p
              id="prompt-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400 whitespace-pre-line"
            >
              {error}
            </p>
          )}
          {saveSuccess && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              Note saved successfully!
            </p>
          )}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {loading ? "Generating..." : "Generate Note"}
        </Button>

        {generatedText && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-gray-50 dark:bg-slate-700 p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                Generated Note
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {generatedText.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 text-gray-700 dark:text-gray-200">
                    {line || <br />}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                variant="secondary"
                size="sm"
                disabled={saveLoading}
              >
                {saveLoading ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteForm;
