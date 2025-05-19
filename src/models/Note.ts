import mongoose, { Schema } from "mongoose";

export interface INote {
  userId: string;
  title?: string;
  content: string;
  contentType: "plain" | "rich"; // Indicate if content is plain text or rich text (HTML/JSON)
  templateId?: string; // Reference to a template if the note was created from one
  createdAt: Date;
  updatedAt: Date;
  lastVersionId?: string; // Reference to the latest version
  isArchived: boolean;
}

export interface NoteDocument extends mongoose.Document, INote {}

const NoteSchema = new Schema<NoteDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      default: "Untitled Note",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    contentType: {
      type: String,
      enum: ["plain", "rich"],
      default: "plain",
    },
    templateId: {
      type: String,
      default: null,
    },
    lastVersionId: {
      type: String,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Add indexes for better query performance
NoteSchema.index({ userId: 1, isArchived: 1 });
NoteSchema.index({ userId: 1, templateId: 1 });

// Delete the existing model to ensure clean recreation
// This is necessary because Mongoose caches models
if (mongoose.models.Note) {
  delete mongoose.models.Note;
}

// Create a fresh model
const Note = mongoose.model<NoteDocument>("Note", NoteSchema);

export default Note;
