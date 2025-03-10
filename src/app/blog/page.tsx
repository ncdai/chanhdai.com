import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { ChanhDaiWordmark } from "@/components/brand/chanhdai-wordmark";
import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import { PostItem } from "@/features/blog/components/post-item";
import { getAllPosts } from "@/features/blog/utils/content";
import { Footer } from "@/features/profile/components/footer";
import { HeaderMotion } from "@/features/profile/components/header-motion";
import { NavDesktop } from "@/features/profile/components/nav/nav-desktop";
import { NavGitHub } from "@/features/profile/components/nav/nav-github";
import { NavMobile } from "@/features/profile/components/nav/nav-mobile";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Blog",
};

export default function Page() {
  const allPosts = getAllPosts();

  // TODO: Create shared layout component
  // But for now, just copy-paste the layout here

  return (
    <>
      <HeaderMotion />

      <div className="max-w-screen overflow-x-hidden">
        <div className="mx-auto px-4 md:max-w-3xl">
          <div className="relative mt-2 min-h-[calc(100vh-0.5rem)] border-x border-grid">
            <div className="screen-line-before screen-line-after flex pl-4">
              <Link href="/" className="relative z-1">
                <ChanhDaiWordmark className="h-16" />
              </Link>
            </div>

            <div className="absolute top-0 -right-px z-1 flex items-center gap-2 ring ring-grid ring-inset">
              <div className="hidden pr-1 pl-3 sm:block">
                <NavDesktop />
              </div>

              <NavGitHub />
              <ToggleTheme />

              <div className="sm:hidden">
                <NavMobile />
              </div>
            </div>

            <div
              className={cn(
                "screen-line-after h-16",
                "before:absolute before:-left-[100vw] before:h-full before:w-[200vw]",
                "before:bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:[--pattern-foreground:var(--color-black)]/5 dark:before:[--pattern-foreground:var(--color-white)]/5"
              )}
            >
              <Button
                className="absolute bottom-0 left-2 z-1"
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/">
                  <ArrowLeftIcon className="size-5" />
                </Link>
              </Button>
            </div>

            <div className="screen-line-after relative px-4">
              <h2 className="font-heading text-2xl font-semibold">Blog</h2>
            </div>

            <div className="divide-y divide-grid">
              {allPosts
                .slice()
                .sort((a, b) =>
                  dayjs(b.metadata.createdAt).diff(dayjs(a.metadata.createdAt))
                )
                .map((post) => {
                  return <PostItem key={post.slug} post={post} />;
                })}
            </div>

            <div className="screen-line-before h-4 w-full" />
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}
