"use client";

import Nav from "@/app/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { createBlog } from "./actions";
import { useOrganization } from "@clerk/nextjs";

export default function OrganizationLandingPage() {
  const [blogContent, setBlogContent] = React.useState("");
  const [blogTitle, setBlogTitle] = React.useState("");

  const selectedOrganization = useOrganization();

  const handleCreateBlog = async () => {
    if (!selectedOrganization?.organization?.id) {
      console.error("No organization selected");
      return;
    }

    if (!blogTitle.trim() || !blogContent.trim()) {
      console.error("Title and content are required");
      return;
    }

    try {
      const result = await createBlog({
        body: blogContent.trim(),
        orgId: selectedOrganization.organization.id,
        title: blogTitle.trim(),
      });

      if (result.success) {
        // Reset form on success
        setBlogTitle("");
        setBlogContent("");
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
    }
  };

  return (
    <>
      <main>
        <Nav />
        <div className="p-10">
          <Input
            placeholder="Title"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
          <Textarea
            placeholder="Enter your blog content here"
            onChange={(e) => setBlogContent(e.target.value)}
            value={blogContent}
          />
          <Button onClick={handleCreateBlog} className="mt-2">
            Create Blog
          </Button>
        </div>
      </main>
    </>
  );
}
