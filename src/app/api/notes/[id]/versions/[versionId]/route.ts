import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import NoteVersion from "@/models/NoteVersion";
import mongoose from "mongoose";

type Params = {
  id: string;
  versionId: string;
};

// GET: Get a specific version of a note
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

    const { id: noteId, versionId } = params;
    if (!noteId || !versionId) {
      return NextResponse.json(
        { error: "Note ID and Version ID are required" },
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

    // Get the specific version
    const version = await NoteVersion.findOne({
      _id: versionId,
      noteId,
    }).lean();

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    return NextResponse.json({
      version: {
        id: (version as any)._id.toString(),
        noteId: (version as any).noteId,
        content: (version as any).content,
        versionNumber: (version as any).versionNumber,
        createdAt: (version as any).createdAt,
        createdBy: (version as any).createdBy,
        comment: (version as any).comment,
      },
    });
  } catch (error) {
    console.error("Error retrieving note version:", error);

    let errorMessage = "Failed to retrieve note version. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Restore a specific version as the current note content
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

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    const { id: noteId, versionId } = params;
    if (!noteId || !versionId) {
      return NextResponse.json(
        { error: "Note ID and Version ID are required" },
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
        { error: "Note not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // Get the version to restore
    const version = await NoteVersion.findOne({
      _id: versionId,
      noteId,
    }).lean();

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // Update the note with the version content
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      {
        content: (version as any).content,
        lastVersionId: versionId,
      },
      { new: true }
    ).lean();

    // Create a new version to record this restore action
    const latestVersion = await NoteVersion.findOne({
      noteId,
    })
      .sort({ versionNumber: -1 })
      .lean();

    const versionNumber = latestVersion
      ? (latestVersion as any).versionNumber + 1
      : 1;

    // Create a new version entry to record the restoration
    await NoteVersion.create({
      noteId,
      content: (version as any).content,
      createdBy: userId,
      versionNumber,
      comment: `Restored from version ${(version as any).versionNumber}`,
    });

    return NextResponse.json({
      success: true,
      note: {
        id: (updatedNote as any)._id.toString(),
        title: (updatedNote as any).title,
        content: (updatedNote as any).content,
        createdAt: (updatedNote as any).createdAt,
        updatedAt: (updatedNote as any).updatedAt,
      },
    });
  } catch (error) {
    console.error("Error restoring note version:", error);

    let errorMessage = "Failed to restore note version. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
