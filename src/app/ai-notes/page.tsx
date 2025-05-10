import React from "react";
import NoteForm from "@/components/ui/NoteForm";

export const metadata = {
  title: "AI Notes - ThinkMate",
  description: "Generate AI-powered notes using OpenAI GPT-4",
};

export default function AINotesPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Notes
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Generate AI-powered notes using OpenAI GPT-4
          </p>
        </div>

        <NoteForm />

        <div className="mt-8 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-700">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
            Tips for effective prompts:
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>Be specific about what you want to generate</li>
            <li>Include context like tone, length, and audience</li>
            <li>Try different prompts for varied results</li>
            <li>For summaries, include the text you want to summarize</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
