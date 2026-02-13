"use client"

import { EllipsisIcon, LinkIcon, ShareIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components//ui/button"
import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { copyText } from "@/utils/copy"

export function PostShareMenu({ title, url }: { title: string; url: string }) {
  const absoluteUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
      ? new URL(url, window.location.origin).toString()
      : url

  const urlEncoded = encodeURIComponent(absoluteUrl)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="active:scale-none"
          variant="secondary"
          size="icon-sm"
        >
          <ShareIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        collisionPadding={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem
          onClick={() => {
            copyText(absoluteUrl)
            toast.success("Link copied")
          }}
        >
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://x.com/intent/tweet?url=${urlEncoded}`}
            target="_blank"
            rel="noopener"
          >
            <Icons.x />
            Share on X
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
            target="_blank"
            rel="noopener"
          >
            <Icons.linkedin />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault() // Prevent the menu from closing
              navigator.share({ title, url: absoluteUrl }).catch(() => {})
            }}
          >
            <EllipsisIcon />
            Other app
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
