import { db } from "@/db";
import { blogTable } from "@/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface Params {
  subdomain: string;
}

export default async function ({ params }: { params: Promise<Params> }) {
  const { subdomain } = await params;
  const client = await clerkClient();
  const org = await client.organizations.getOrganization({ slug: subdomain });

  const orgId = org.id;
  const blogs = await db
    .select()
    .from(blogTable)
    .where(eq(blogTable.orgId, orgId));

  // Move console.log outside the render
  console.log("All blogs:", blogs);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Blog Posts
        </h1>

        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
            >
              {/* Blog Header */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  {blog.title}
                </h2>
                {blog.content && (
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    {blog.content}
                  </h3>
                )}
              </div>

              {/* Blog Body */}
              <div className="mb-4">
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {blog.body}
                </p>
              </div>

              {/* Blog Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  ID: {blog.id.slice(0, 8)}...
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No blog posts found</div>
            <p className="text-gray-400 mt-2">
              Create your first blog post to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
