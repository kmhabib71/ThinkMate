import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import NoteAttachment from "@/models/NoteAttachment";
import { deleteFile } from "@/lib/fileUpload";
import path from "path";

type Params = {
  id: string;
};

// DELETE: Remove a file attachment
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

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    const attachmentId = params.id;
    if (!attachmentId) {
      return NextResponse.json(
        { error: "Attachment ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the attachment
    const attachment = await NoteAttachment.findOne({
      _id: attachmentId,
      userId,
    }).lean();

    if (!attachment) {
      return NextResponse.json(
        {
          error:
            "Attachment not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    // Get the file path to delete
    const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
    const filePath = path.join(
      UPLOAD_DIR,
      userId,
      (attachment as any).filename
    );

    // Delete file from storage
    await deleteFile(path.resolve(filePath));

    // Delete from database
    await NoteAttachment.deleteOne({ _id: attachmentId, userId });

    return NextResponse.json({
      success: true,
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attachment:", error);

    let errorMessage = "Failed to delete attachment. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
