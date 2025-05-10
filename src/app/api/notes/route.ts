import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import mongoose from "mongoose";

// Define types for Mongoose documents
interface NoteDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define a type for lean (plain JavaScript) documents
interface LeanNoteDocument {
  _id: any;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const { title = "Untitled Note", content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    console.log("Creating note for user:", userId);

    // Create a new note
    const noteData = {
      userId: userId,
      title,
      content,
    };

    console.log("Note data to save:", noteData);

    const note = (await Note.create(noteData)) as NoteDocument;

    console.log("Note saved with ID:", note._id);

    return NextResponse.json(
      {
        success: true,
        note: {
          id: note._id.toString(),
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving note:", error);
    // Provide more detailed error information
    let errorMessage = "Failed to save note. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    console.log("Fetching notes for user:", userId);

    // Get notes for the user, sorted by newest first
    const notes = (await Note.find({
      userId: userId,
    })
      .sort({ createdAt: -1 })
      .select("title content createdAt")
      .lean()) as LeanNoteDocument[];

    console.log(`Found ${notes.length} notes for user ${userId}`);

    // Format notes for response
    const formattedNotes = notes.map((note) => ({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
    }));

    return NextResponse.json({ notes: formattedNotes });
  } catch (error) {
    console.error("Error retrieving notes:", error);

    let errorMessage = "Failed to retrieve notes. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
