import mongoose from "mongoose";
import dbConnect from "@/lib/db";

/**
 * This function updates the Note collection schema
 * It should be run once to fix any issues with the existing collection
 */
export async function updateNoteCollectionSchema() {
  // Connect to the database
  await dbConnect();

  try {
    // Check if database connection is established
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    // Drop the existing 'notes' collection if it exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const noteCollectionExists = collections.some((c) => c.name === "notes");

    if (noteCollectionExists) {
      console.log("Dropping existing notes collection to reset schema");
      await mongoose.connection.db.dropCollection("notes");
      console.log("Notes collection dropped successfully");
    } else {
      console.log("No existing notes collection found, will create fresh");
    }

    // The collection will be recreated with proper schema when first accessed
    console.log("Note collection schema migration complete");
    return { success: true };
  } catch (error) {
    console.error("Error during note schema migration:", error);
    throw error;
  }
}
