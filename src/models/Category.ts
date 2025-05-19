import mongoose, { Schema } from "mongoose";

export interface ICategory {
  userId: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface CategoryDocument extends mongoose.Document, ICategory {}

const CategorySchema = new Schema<CategoryDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for userId and name to prevent duplicate categories per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Delete the existing model to ensure clean recreation
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

// Create a fresh model
const Category = mongoose.model<CategoryDocument>("Category", CategorySchema);

export default Category;
