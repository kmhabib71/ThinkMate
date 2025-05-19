import mongoose, { Schema } from "mongoose";

export interface INoteVersion {
  noteId: string;
  content: string;
  createdBy: string;
  versionNumber: number;
  comment?: string;
}

export interface NoteVersionDocument extends mongoose.Document, INoteVersion {}

const NoteVersionSchema = new Schema<NoteVersionDocument>(
  {
    noteId: {
      type: String,
      required: [true, "Note ID is required"],
      index: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    createdBy: {
      type: String,
      required: [true, "Creator ID is required"],
    },
    versionNumber: {
      type: Number,
      required: [true, "Version number is required"],
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for noteId and versionNumber
NoteVersionSchema.index({ noteId: 1, versionNumber: 1 }, { unique: true });

// Delete the existing model to ensure clean recreation
if (mongoose.models.NoteVersion) {
  delete mongoose.models.NoteVersion;
}

// Create a fresh model
const NoteVersion = mongoose.model<NoteVersionDocument>(
  "NoteVersion",
  NoteVersionSchema
);

export default NoteVersion;
