import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import NoteForm from "@/components/ui/NoteForm";

export const metadata: Metadata = {
  title: "Create Note | ThinkMate",
  description: "Create a new note using ThinkMate",
};

export default async function NewNotePage() {
  // Check if user is authenticated
  const session = await getServerSession(authConfig);

  if (!session) {
    // Redirect to sign-in page if not authenticated
    redirect("/auth/sign-in");
  }

  return (
    <div className="container mx-auto py-10 mt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Note</h1>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300">
          Use the AI-powered note generator to create your note:
        </p>

        <div className="grid grid-cols-1 gap-6">
          <NoteForm className="dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
