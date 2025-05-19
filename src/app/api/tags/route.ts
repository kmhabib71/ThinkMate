import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";
import mongoose from "mongoose";

interface TagDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  color: string;
}

// GET: Retrieve all tags for the current user
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

    // Connect to database
    await dbConnect();

    // Get all tags for the user
    const tags = await Tag.find({ userId }).lean();

    // Format the tags for the response
    const formattedTags = tags.map((tag: any) => ({
      id: tag._id.toString(),
      name: tag.name,
      color: tag.color,
    }));

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error("Error retrieving tags:", error);

    let errorMessage = "Failed to retrieve tags. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new tag
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

    // Parse request body
    const { name, color } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if tag already exists for this user
    const existingTag = await Tag.findOne({
      userId,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 409 }
      );
    }

    // Create the tag
    const tagDoc = await Tag.create({
      userId,
      name: name.trim(),
      color: color || "#3b82f6", // Default blue color
    });

    return NextResponse.json({
      success: true,
      tag: {
        id: (tagDoc as any)._id.toString(),
        name: tagDoc.name,
        color: tagDoc.color,
      },
    });
  } catch (error) {
    console.error("Error creating tag:", error);

    let errorMessage = "Failed to create tag. Please try again.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
