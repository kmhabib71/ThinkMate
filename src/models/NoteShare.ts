import mongoose, { Schema } from "mongoose";

export enum PermissionLevel {
  VIEW = "view",
  COMMENT = "comment",
  EDIT = "edit",
  ADMIN = "admin",
}

export interface INoteShare {
  noteId: string;
  ownerId: string;
  sharedWithId?: string; // User ID if shared with a specific user
  sharedWithEmail?: string; // Email if shared via email
  shareLink?: string; // Token for public link sharing
  permission: PermissionLevel;
  expiresAt?: Date; // Optional expiration date
}

export interface NoteShareDocument extends mongoose.Document, INoteShare {}

const NoteShareSchema = new Schema<NoteShareDocument>(
  {
    noteId: {
      type: String,
      required: [true, "Note ID is required"],
      index: true,
    },
    ownerId: {
      type: String,
      required: [true, "Owner ID is required"],
      index: true,
    },
    sharedWithId: {
      type: String,
      default: null,
      index: true,
    },
    sharedWithEmail: {
      type: String,
      default: null,
      index: true,
    },
    shareLink: {
      type: String,
      default: null,
      index: true,
    },
    permission: {
      type: String,
      enum: Object.values(PermissionLevel),
      default: PermissionLevel.VIEW,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for faster queries
NoteShareSchema.index({ noteId: 1, sharedWithId: 1 });
NoteShareSchema.index({ noteId: 1, sharedWithEmail: 1 });
NoteShareSchema.index({ shareLink: 1 });

// Delete the existing model to ensure clean recreation
if (mongoose.models.NoteShare) {
  delete mongoose.models.NoteShare;
}

// Create a fresh model
const NoteShare = mongoose.model<NoteShareDocument>(
  "NoteShare",
  NoteShareSchema
);

export default NoteShare;
