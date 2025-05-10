import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { updateNoteCollectionSchema } from "@/lib/migrations/updateNoteSchema";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This is a simple check - in a real app you might want to store admin rights in the DB
    // For now we'll just execute this for any authenticated user for simplicity

    console.log("Running schema migration");
    const result = await updateNoteCollectionSchema();
    console.log("Migration complete:", result);

    return NextResponse.json({
      success: true,
      message: "Note schema updated successfully",
    });
  } catch (error) {
    console.error("Schema migration error:", error);

    let errorMessage = "Failed to update schema.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
