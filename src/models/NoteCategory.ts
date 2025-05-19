import mongoose, { Schema } from "mongoose";

export interface INoteCategory {
  noteId: string;
  categoryId: string;
}

export interface NoteCategoryDocument
  extends mongoose.Document,
    INoteCategory {}

const NoteCategorySchema = new Schema<NoteCategoryDocument>(
  {
    noteId: {
      type: String,
      required: [true, "Note ID is required"],
      index: true,
    },
    categoryId: {
      type: String,
      required: [true, "Category ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for noteId and categoryId to prevent duplicates
NoteCategorySchema.index({ noteId: 1, categoryId: 1 }, { unique: true });

// Delete the existing model to ensure clean recreation
if (mongoose.models.NoteCategory) {
  delete mongoose.models.NoteCategory;
}

// Create a fresh model
const NoteCategory = mongoose.model<NoteCategoryDocument>(
  "NoteCategory",
  NoteCategorySchema
);

export default NoteCategory;
