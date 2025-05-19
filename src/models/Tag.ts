import mongoose, { Schema } from "mongoose";

export interface ITag {
  userId: string;
  name: string;
  color: string;
}

export interface TagDocument extends mongoose.Document, ITag {}

const TagSchema = new Schema<TagDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
    },
    color: {
      type: String,
      default: "#3b82f6", // Default blue color
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for userId and name to prevent duplicate tags per user
TagSchema.index({ userId: 1, name: 1 }, { unique: true });

// Delete the existing model to ensure clean recreation
if (mongoose.models.Tag) {
  delete mongoose.models.Tag;
}

// Create a fresh model
const Tag = mongoose.model<TagDocument>("Tag", TagSchema);

export default Tag;
