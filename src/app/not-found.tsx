import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/" passHref>
          <Button variant="primary" className="mx-auto">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
