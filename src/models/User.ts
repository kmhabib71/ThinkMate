import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name?: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
}

export interface UserDocument extends mongoose.Document, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: String,
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    image: String,
    emailVerified: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;
  if (!user.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

// Use existing model if it exists, or create a new one
const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
