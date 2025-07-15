"use server";

import { blogTable, CreateBlogType } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { revalidatePath } from "next/cache";

const db = drizzle(process.env.DATABASE_URL);

export const createBlog = async (payload: CreateBlogType) => {
  try {
    await db.insert(blogTable).values(payload);

    // Revalidate the current path to refresh any cached data
    revalidatePath("/org/[slug]", "page");

    return { success: true, message: "Blog created successfully" };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, message: "Failed to create blog" };
  }
};
