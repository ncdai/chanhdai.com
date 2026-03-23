import { readFileSync } from "node:fs"
import { join } from "node:path"

import { ImageResponse } from "next/og"

const geistSemiBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")
)

const geistMonoRegular = readFileSync(
  join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf")
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get("title")
  const description = searchParams.get("description")

  return new ImageResponse(
    (
      <div tw="flex h-full w-full bg-black text-zinc-50">
        <div tw="absolute inset-y-0 left-12 flex w-px border border-zinc-800/80" />
        <div tw="absolute inset-y-0 right-12 flex w-px border border-zinc-800/80" />
        <div tw="absolute inset-x-0 top-12 flex h-px border border-zinc-800/80" />
        <div tw="absolute inset-x-0 bottom-12 flex h-px border border-zinc-800/80" />

        <div tw="absolute right-24 bottom-24 flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 256"
            width={128}
            height={64}
          >
            <path
              fill="currentColor"
              d="M192 256H64v-64h128v64ZM448 64H320v128h128v64H256V0h192v64ZM64 192H0V64h64v128ZM512 192h-64V64h64v128ZM192 64H64V0h128v64Z"
            />
          </svg>
        </div>

        <div tw="absolute inset-x-0 inset-y-12 flex flex-col justify-center">
          <div
            tw="border-b-2 border-zinc-800/80 px-24"
            style={{
              fontFamily: "GeistSans",
              fontWeight: 600,
              fontSize: 64,
              lineHeight: 1,
              textWrap: "balance",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </div>

          {description && (
            <div tw="flex flex-col grow">
              <div
                tw="border-b-2 border-zinc-800/80 px-24 py-8 text-zinc-400"
                style={{
                  fontFamily: "GeistMono",
                  fontWeight: 400,
                  fontSize: 32,
                  lineHeight: 1.25,
                  textWrap: "balance",
                }}
              >
                {description}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "GeistSans",
          data: geistSemiBold,
          weight: 600,
        },
        {
          name: "GeistMono",
          data: geistMonoRegular,
          weight: 400,
        },
      ],
    }
  )
}
