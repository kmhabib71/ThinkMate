import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import NoteVersion from "@/models/NoteVersion";
import mongoose from "mongoose";

type Params = {
  id: string;
};

// GET: Get all versions of a note
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

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    const noteId = params.id;
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if the note belongs to the user
    const note = await Note.findOne({
      _id: noteId,
      userId,
    }).lean();

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or you don't have permission to access it" },
        { status: 404 }
      );
    }

    // Get all versions of the note
    const versions = await NoteVersion.find({
      noteId,
    })
      .sort({ versionNumber: -1 })
      .lean();

    // Format the versions for the response
    const formattedVersions = versions.map((version: any) => ({
      id: version._id.toString(),
      versionNumber: version.versionNumber,
      createdAt: version.createdAt,
      createdBy: version.createdBy,
      comment: version.comment,
    }));

    return NextResponse.json({ versions: formattedVersions });
  } catch (error) {
    console.error("Error retrieving note versions:", error);

    let errorMessage = "Failed to retrieve note versions. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new version of a note
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    const noteId = params.id;
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Parse request body
    const { content, comment } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if the note belongs to the user
    const note = await Note.findOne({
      _id: noteId,
      userId,
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or you don't have permission to access it" },
        { status: 404 }
      );
    }

    // Get the latest version number
    const latestVersion = await NoteVersion.findOne({
      noteId,
    })
      .sort({ versionNumber: -1 })
      .lean();

    const versionNumber = latestVersion
      ? (latestVersion as any).versionNumber + 1
      : 1;

    // Create a new version
    const newVersion = await NoteVersion.create({
      noteId,
      content,
      createdBy: userId,
      versionNumber,
      comment: comment || `Version ${versionNumber}`,
    });

    // Update the note with the ID of the latest version
    await Note.updateOne(
      { _id: noteId },
      { lastVersionId: newVersion._id.toString() }
    );

    return NextResponse.json({
      success: true,
      version: {
        id: newVersion._id.toString(),
        versionNumber: newVersion.versionNumber,
        createdAt: newVersion.createdAt,
        createdBy: newVersion.createdBy,
        comment: newVersion.comment,
      },
    });
  } catch (error) {
    console.error("Error creating note version:", error);

    let errorMessage = "Failed to create note version. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
