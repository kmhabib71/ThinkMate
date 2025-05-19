import mongoose, { Schema } from "mongoose";

export interface INoteTag {
  noteId: string;
  tagId: string;
}

export interface NoteTagDocument extends mongoose.Document, INoteTag {}

const NoteTagSchema = new Schema<NoteTagDocument>(
  {
    noteId: {
      type: String,
      required: [true, "Note ID is required"],
      index: true,
    },
    tagId: {
      type: String,
      required: [true, "Tag ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for noteId and tagId to prevent duplicates
NoteTagSchema.index({ noteId: 1, tagId: 1 }, { unique: true });

// Delete the existing model to ensure clean recreation
if (mongoose.models.NoteTag) {
  delete mongoose.models.NoteTag;
}

// Create a fresh model
const NoteTag = mongoose.model<NoteTagDocument>("NoteTag", NoteTagSchema);

export default NoteTag;
