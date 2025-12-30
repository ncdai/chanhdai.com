import { sponsors } from "@/features/sponsors/data";

export async function GET() {
  const usernames = sponsors
    .filter((s) => s.type === "individual")
    .map((s) => s.username);

  if (usernames.length === 0) {
    return new Response("No sponsors found", { status: 404 });
  }

  const size = 64;
  const perRow = 10;
  const spacing = 4;

  const rows = Math.ceil(usernames.length / perRow);
  const width = Math.min(usernames.length, perRow) * (size + spacing) - spacing;
  const height = rows * (size + spacing) - spacing;

  const svg = generateAvatarsSVG(
    usernames,
    size,
    perRow,
    spacing,
    width,
    height
  );

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function generateAvatarsSVG(
  usernames: string[],
  size: number,
  perRow: number,
  spacing: number,
  width: number,
  height: number
): string {
  let clipPaths = "";
  let avatarsContent = "";

  usernames.forEach((username, index) => {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    const x = col * (size + spacing);
    const y = row * (size + spacing);
    const avatarUrl = `https://github.com/${username}.png`;

    clipPaths += `
    <clipPath id="clip-${index}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>`;

    avatarsContent += `
    <g transform="translate(${x}, ${y})">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#e1e4e8" />
      <image
        href="${avatarUrl}"
        width="${size}"
        height="${size}"
        clip-path="url(#clip-${index})"
      />
    </g>`;
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${clipPaths}
  </defs>${avatarsContent}
</svg>`;
}
