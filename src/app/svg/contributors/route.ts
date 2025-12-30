import { SOURCE_CODE_GITHUB_REPO } from "@/config/site";

import { generateGitHubAvatarsSVG } from "../utils";

type GitHubContributor = {
  login: string; // GitHub username
};

async function fetchContributors(): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${SOURCE_CODE_GITHUB_REPO}/contributors`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
    }
  );

  if (!response.ok) {
    return [];
  }

  const contributors = (await response.json()) as GitHubContributor[];

  return contributors.map((c) => c.login);
}

export async function GET() {
  const usernames = await fetchContributors();

  if (usernames.length === 0) {
    return new Response("No contributors found", { status: 404 });
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
