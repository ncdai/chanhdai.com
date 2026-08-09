import Link from "next/link"
import { ArrowRightIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Daikanoid } from "@/registry/blocks/not-found-01/components/daikanoid"

export default function NotFound() {
  return (
    <div>
      <Empty className="py-12 max-lg:min-h-svh">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>

          <EmptyTitle className="text-base">Page not found</EmptyTitle>

          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button variant="outline" asChild>
            <Link href="/">
              Go to Home
              <ArrowRightIcon />
            </Link>
          </Button>
        </EmptyContent>
      </Empty>

      {/* The canvas is fixed at 800x600, so the game is desktop only. */}
      <section className="place-items-center pb-6 max-lg:hidden">
        <Daikanoid />
      </section>
    </div>
  )
}
