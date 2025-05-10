"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user is loading
    if (status === "loading") return;

    // If the user is not authenticated, redirect to the login page
    if (status === "unauthenticated") {
      router.push(`/auth/sign-in?callbackUrl=${pathname}`);
    }
  }, [status, router, pathname]);

  // If the authentication is loading or the user is not authenticated, don't render the children
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  // If the user is authenticated, render the children
  return <>{children}</>;
}
