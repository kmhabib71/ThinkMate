import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import NoteList from "@/components/ui/NoteList";

export const metadata: Metadata = {
  title: "Dashboard | ThinkMate",
  description: "Your ThinkMate dashboard",
};

export default async function DashboardPage() {
  // Check if user is authenticated
  const session = await getServerSession(authConfig);

  if (!session) {
    // Redirect to sign-in page if not authenticated
    redirect("/auth/sign-in");
  }

  const user = session.user;

  return (
    <div className="container mx-auto py-10 mt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user.name || "User"}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            {user.image && (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-10 w-10 rounded-full"
              />
            )}
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome to your ThinkMate dashboard. Here are your notes:
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <NoteList />
        </div>
      </div>
    </div>
  );
}
