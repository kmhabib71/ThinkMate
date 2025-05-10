import mongoose, { Schema } from "mongoose";

export interface INote {
  userId: string;
  title?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Delete the existing model to ensure clean recreation
// This is necessary because Mongoose caches models
if (mongoose.models.Note) {
  delete mongoose.models.Note;
}

// Create a fresh model
const Note = mongoose.model<NoteDocument>("Note", NoteSchema);

export default Note;
