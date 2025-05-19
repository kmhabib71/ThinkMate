import mongoose, { Schema } from "mongoose";

export interface INoteAttachment {
  noteId: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NoteAttachmentDocument
  extends mongoose.Document,
    INoteAttachment {}

// Define a type for lean (plain JavaScript) documents
export interface LeanNoteAttachmentDocument extends INoteAttachment {
  _id: mongoose.Types.ObjectId;
  __v?: number;
}

const NoteAttachmentSchema = new Schema<NoteAttachmentDocument>(
  {
    noteId: {
      type: String,
      required: [true, "Note ID is required"],
      index: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    filename: {
      type: String,
      required: [true, "File name is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
NoteAttachmentSchema.index({ noteId: 1, userId: 1 });

// Delete the existing model to ensure clean recreation
if (mongoose.models.NoteAttachment) {
  delete mongoose.models.NoteAttachment;
}

// Create a fresh model
const NoteAttachment = mongoose.model<NoteAttachmentDocument>(
  "NoteAttachment",
  NoteAttachmentSchema
);

export default NoteAttachment;
