import type { ProfilePage as PageSchema, WithContext } from "schema-dts"

import { About } from "@/features/portfolio/components/about"
import { Awards } from "@/features/portfolio/components/awards"
import { Blog } from "@/features/portfolio/components/blog"
import { Bookmarks } from "@/features/portfolio/components/bookmarks"
import { Certifications } from "@/features/portfolio/components/certifications"
import { Components } from "@/features/portfolio/components/components"
import { Experiences } from "@/features/portfolio/components/experiences"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileCover } from "@/features/portfolio/components/profile-cover"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { Sponsors } from "@/features/portfolio/components/sponsors"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { TestimonialsMarquee } from "@/features/portfolio/components/testimonials-marquee"
import { USER } from "@/features/portfolio/data/user"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22">
        <ProfileCover />
        <ProfileHeader />
        <Separator />

        <Overview />
        <Separator />

        <SocialLinks />
        <Separator />

        <About />
        <div className="flex h-4 w-full border-x border-edge" />

        <TestimonialsMarquee />
        <div className="flex h-4 w-full border-x border-edge" />

        <GitHubContributions />
        <Separator />

        <TechStack />
        <Separator />

        <Components />
        <Separator />

        <Blog />
        <Separator />

        <Experiences />
        <Separator />

        <Projects />
        <Separator />

        <Awards />
        <Separator />

        <Certifications />
        <Separator />

        <Bookmarks />
        <Separator />

        <Sponsors />
        <Separator />
      </div>
    </>
  )
}

function getPageJsonLd(): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  }
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  )
}
