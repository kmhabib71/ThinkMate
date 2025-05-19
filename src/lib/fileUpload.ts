import { NextRequest } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";

// For development mode, we'll use local file storage
// In production, you should use AWS S3 or similar cloud storage
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10); // 10MB default

// Define allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
  "application/zip",
];

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

interface UploadError extends Error {
  code: string;
}

// Ensure upload directory exists
export const ensureUploadDir = async (userId: string) => {
  const userUploadDir = path.join(UPLOAD_DIR, userId);
  try {
    await mkdir(userUploadDir, { recursive: true });
    return userUploadDir;
  } catch (error) {
    console.error("Error creating upload directory:", error);
    throw error;
  }
};

export const validateFile = (
  file: File,
  allowedTypes = ALLOWED_MIME_TYPES,
  maxSize = MAX_FILE_SIZE
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the maximum allowed size of ${
        maxSize / 1024 / 1024
      }MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
};

export const uploadFile = async (
  file: File,
  userId: string
): Promise<UploadedFile> => {
  // Validate the file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Ensure upload directory exists
  const userUploadDir = await ensureUploadDir(userId);

  // Generate a unique filename to prevent collisions
  const fileExtension = path.extname(file.name);
  const randomName = crypto.randomBytes(16).toString("hex");
  const filename = `${randomName}${fileExtension}`;
  const filePath = path.join(userUploadDir, filename);

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Write file to disk
  await writeFile(filePath, new Uint8Array(buffer));

  // Generate a URL for the file
  // In development, this would be a local path
  // In production, this would be a CDN or S3 URL
  const url = `/uploads/${userId}/${filename}`;

  return {
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url,
  };
};

// Function to extract files from FormData in Next.js API routes
export const extractFilesFromRequest = async (
  req: NextRequest
): Promise<{ files: File[]; formData: FormData }> => {
  const formData = await req.formData();

  const files: File[] = [];

  // Extract file entries from FormData
  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    if (value instanceof File) {
      files.push(value);
      // Remove file from formData to avoid duplication
      formData.delete(key);
    }
  }

  return { files, formData };
};

// Function to delete a file
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const absolutePath = path.resolve(filePath);

    // Make sure we're deleting from our uploads directory for security
    if (!absolutePath.startsWith(path.resolve(UPLOAD_DIR))) {
      throw new Error("Cannot delete files outside of upload directory");
    }

    await fs.promises.unlink(absolutePath);
    return true;
  } catch (error) {
    const err = error as UploadError;
    // If file doesn't exist, just return true
    if (err.code === "ENOENT") {
      return true;
    }
    console.error("Error deleting file:", error);
    return false;
  }
};
