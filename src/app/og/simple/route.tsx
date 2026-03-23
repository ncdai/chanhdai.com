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
      <div tw="w-full h-full flex text-zinc-50 bg-black">
        <div tw="absolute flex inset-y-0 w-px border border-zinc-900 left-12" />
        <div tw="absolute flex inset-y-0 w-px border border-zinc-900 right-12" />
        <div tw="absolute flex inset-x-0 h-px border border-zinc-900 top-12" />
        <div tw="absolute flex inset-x-0 h-px border border-zinc-900 bottom-12" />

        <div tw="absolute flex bottom-24 right-24">
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

        <div tw="absolute inset-24 flex flex-col w-[832px] justify-center">
          <div
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
            <div
              tw="grow mt-6 text-zinc-400"
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
