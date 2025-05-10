"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyNotesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page since we've moved the notes listing there
    router.push("/dashboard");
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="container mx-auto py-12 px-4 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    </div>
  );
}
