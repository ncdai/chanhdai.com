"use client"

import { copyText } from "@/utils/copy"
import { EllipsisIcon, LinkIcon, ShareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { LinkedInIcon, XIcon } from "@/components/icons"

export function DocShareMenu({ title, url }: { title: string; url: string }) {
  const absoluteUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
      ? new URL(url, window.location.origin).toString()
      : url

  const urlEncoded = encodeURIComponent(absoluteUrl)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="size-7 border-none active:scale-none"
            variant="secondary"
            size="icon-sm"
          />
        }
      >
        <ShareIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-fit"
        align="start"
        alignOffset={-6}
        collisionPadding={16}
        finalFocus={false}
      >
        <DropdownMenuItem
          onClick={() => {
            copyText(absoluteUrl)
            toast.add({ type: "success", title: "Link copied" })
          }}
        >
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <a
              href={`https://x.com/intent/tweet?url=${urlEncoded}`}
              target="_blank"
              rel="noopener"
            />
          }
        >
          <XIcon />
          Share on X
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <a
              href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
              target="_blank"
              rel="noopener"
            />
          }
        >
          <LinkedInIcon />
          Share on LinkedIn
        </DropdownMenuItem>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <DropdownMenuItem
            closeOnClick={false}
            onClick={() => {
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
