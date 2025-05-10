// Type definitions for Next.js App Router route handlers
import { NextRequest, NextResponse } from "next/server";

declare module "next/server" {
  export interface RouteHandlerContext<T = Record<string, string>> {
    params: T;
  }

  export type RouteHandler<T = Record<string, string>> = (
    request: NextRequest,
    context: RouteHandlerContext<T>
  ) => Promise<NextResponse> | NextResponse;
}
