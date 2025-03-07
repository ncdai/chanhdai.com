import { notFound } from "next/navigation";

import { MDX } from "@/components/mdx";
import { DrawerPost } from "@/features/blog/components/drawer-post";
import { getAllPosts } from "@/features/blog/utils/content";

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const slug = (await params).slug;
  const post = getAllPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <DrawerPost metadata={post.metadata}>
      <MDX code={post.content} />
    </DrawerPost>
  );
}
