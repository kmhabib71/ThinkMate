"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try again or return to the
          home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
