import { sponsors } from "@/features/sponsors/data";

import { generateGitHubAvatarsSVG } from "../utils";

export async function GET() {
  const usernames = sponsors
    .filter((s) => s.type === "individual")
    .map((s) => s.username);

  if (usernames.length === 0) {
    return new Response("No sponsors found", { status: 404 });
  }

  const svg = await generateGitHubAvatarsSVG({
    usernames,
    size: 64,
    perRow: 10,
    spacing: 4,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400", // Cache for 1 day
    },
  });
}
