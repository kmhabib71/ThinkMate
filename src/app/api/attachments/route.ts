import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import NoteAttachment, {
  NoteAttachmentDocument,
  LeanNoteAttachmentDocument,
} from "@/models/NoteAttachment";
import {
  extractFilesFromRequest,
  uploadFile,
  deleteFile,
} from "@/lib/fileUpload";
import mongoose from "mongoose";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";

// POST: Upload a file attachment
export async function POST(request: NextRequest) {
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

    // Extract the noteId from the request URL
    const url = new URL(request.url);
    const noteId = url.searchParams.get("noteId");
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Extract files from the request
    const { files, formData } = await extractFilesFromRequest(request);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Upload files and save to the database
    const uploadPromises = files.map(async (file) => {
      // Upload the file to storage
      const uploadedFile = await uploadFile(file, userId);

      // Save file information to the database
      const doc = await NoteAttachment.create({
        noteId,
        userId,
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        size: uploadedFile.size,
        url: uploadedFile.url,
      });

      // Use type assertion to access properties
      const attachment = doc as unknown as {
        _id: { toString: () => string };
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        createdAt: Date;
      };

      return {
        id: attachment._id.toString(),
        filename: attachment.filename,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.size,
        url: attachment.url,
        createdAt: attachment.createdAt,
      };
    });

    const attachments = await Promise.all(uploadPromises);

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error("Error uploading files:", error);

    let errorMessage = "Failed to upload files. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET: Retrieve all attachments for a specific note
export async function GET(request: NextRequest) {
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

    // Extract the noteId from the request URL
    const url = new URL(request.url);
    const noteId = url.searchParams.get("noteId");
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get all attachments for the note
    const attachments = await NoteAttachment.find({
      noteId,
      userId,
    }).lean();

    // Format the attachments for the response
    const formattedAttachments = attachments.map((attachment: any) => ({
      id: attachment._id.toString(),
      filename: attachment.filename,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: attachment.url,
      createdAt: attachment.createdAt,
    }));

    return NextResponse.json({ attachments: formattedAttachments });
  } catch (error) {
    console.error("Error retrieving attachments:", error);

    let errorMessage = "Failed to retrieve attachments. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
