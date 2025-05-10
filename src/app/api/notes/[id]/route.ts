import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import mongoose from "mongoose";

type Params = {
  id: string;
};

// Get a specific note by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;
    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Get user ID from session
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    // Get the note and check if it belongs to the user
    const note = await Note.findOne({
      _id: noteId,
      userId: userId,
    }).lean();

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({
      note: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error retrieving note:", error);

    let errorMessage = "Failed to retrieve note. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Update a note by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;
    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    // Parse request body
    const { title, content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user ID from session
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    // Update the note and check if it belongs to the user
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: userId,
      },
      {
        title: title || "Untitled Note",
        content,
      },
      { new: true }
    ).lean();

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note: {
        id: updatedNote._id.toString(),
        title: updatedNote.title,
        content: updatedNote.content,
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating note:", error);

    let errorMessage = "Failed to update note. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Delete a note by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;
    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Get user ID from session
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    // Delete the note and check if it belongs to the user
    const result = await Note.deleteOne({
      _id: noteId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Note not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);

    let errorMessage = "Failed to delete note. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
