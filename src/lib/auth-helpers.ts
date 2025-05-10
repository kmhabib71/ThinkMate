import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Helper function to check if a request is authenticated in API routes
 */
export async function isAuthenticated(req: NextRequest) {
  const token = await getToken({ req });
  return !!token;
}

/**
 * Protect an API route - use this to wrap API handlers
 */
export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest) => {
    const isAuthed = await isAuthenticated(req);

    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req);
  };
}

/**
 * Get the current user from a request
 */
export async function getCurrentUser(req: NextRequest) {
  const token = await getToken({ req });
  return token;
}
