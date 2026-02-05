import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const domain = searchParams.get("domain")
  const isForSale = searchParams.get("sale") === "true"

  const magistralMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/Magistral-Medium.ttf")
  )

  const robotoMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/Roboto-Medium.ttf")
  )

  return new ImageResponse(
    (
      <div tw="flex text-black bg-white w-full h-full p-16">
        <div tw="flex-1 flex flex-col justify-center border-l border-r border-zinc-200">
          <div tw="flex justify-center border-t border-b border-zinc-200">
            <h1
              tw="mt-8 mb-4 ml-8 mr-8 font-medium"
              style={{
                fontFamily: "Magistral",
                fontSize: 88,
              }}
            >
              {domain}
            </h1>
          </div>

          <div tw="flex justify-center border-b border-zinc-200">
            <p
              tw="mt-0 mb-0 pt-4 pb-4 pl-8 pr-8 font-medium"
              style={{
                fontFamily: "Roboto",
                fontSize: 32,
                color: isForSale ? "#22c55e" : "#71717a",
              }}
            >
              {isForSale
                ? "The domain name is for sale"
                : "The website will be launched soon"}
            </p>
          </div>
        </div>

        <div tw="absolute flex inset-y-0 w-px bg-zinc-200 left-16" />
        <div tw="absolute flex inset-y-0 w-px bg-zinc-200 right-16" />
        <div tw="absolute flex inset-x-0 h-px bg-zinc-200 top-16" />
        <div tw="absolute flex inset-x-0 h-px bg-zinc-200 bottom-16" />

        <div tw="absolute flex bottom-16 right-16">
          <svg
            width={160}
            height={80}
            viewBox="0 0 640 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M192 0H224V64H192V0ZM64 0H192V64H64V0ZM0 64H64V256H0V64ZM64 256H192V320H64V256ZM192 256H224V320H192V256ZM224 192H288V256H224V192ZM288 128H352V192H288V128ZM352 64H416V128H352V64ZM416 0H448V64H416V0ZM448 0H576V64H448V0ZM576 64H640V256H576V64ZM448 256H576V320H448V256ZM416 256H448V320H416V256Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Magistral",
          data: magistralMedium,
          weight: 500,
        },
        {
          name: "Roboto",
          data: robotoMedium,
          weight: 500,
        },
      ],
    }
  )
}
