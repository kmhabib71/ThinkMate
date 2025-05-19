import mongoose, { Schema } from "mongoose";

export interface ITemplate {
  userId: string;
  name: string;
  description?: string;
  content: string;
  isPublic: boolean;
  categoryId?: string;
}

export interface TemplateDocument extends mongoose.Document, ITemplate {}

const TemplateSchema = new Schema<TemplateDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for userId and name to prevent duplicate templates per user
TemplateSchema.index({ userId: 1, name: 1 }, { unique: true });

// Delete the existing model to ensure clean recreation
if (mongoose.models.Template) {
  delete mongoose.models.Template;
}

// Create a fresh model
const Template = mongoose.model<TemplateDocument>("Template", TemplateSchema);

export default Template;
