export async function fetchAvatarAsBase64(
  username: string,
  size = 128
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://github.com/${username}.png?size=${size}`
    );
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/png";

    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

type GenerateAvatarsSVGOptions = {
  usernames: string[];
  avatarDataUrls: (string | null)[];
  size: number;
  perRow: number;
  spacing: number;
  width: number;
  height: number;
};

export function generateAvatarsSVG({
  usernames,
  avatarDataUrls,
  size,
  perRow,
  spacing,
  width,
  height,
}: GenerateAvatarsSVGOptions): string {
  let clipPaths = "";
  let avatarsContent = "";

  usernames.forEach((_username, index) => {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    const x = col * (size + spacing);
    const y = row * (size + spacing);
    const avatarDataUrl = avatarDataUrls[index];

    clipPaths += `
    <clipPath id="clip-${index}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>`;

    const imageElement = avatarDataUrl
      ? `<image
        href="${avatarDataUrl}"
        width="${size}"
        height="${size}"
        clip-path="url(#clip-${index})"
      />`
      : "";

    avatarsContent += `
    <g transform="translate(${x}, ${y})">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#e1e4e8" />
      ${imageElement}
    </g>`;
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${clipPaths}
  </defs>${avatarsContent}
</svg>`;
}

type GenerateGitHubAvatarsSVGOptions = {
  usernames: string[];
  size?: number;
  perRow?: number;
  spacing?: number;
};

export async function generateGitHubAvatarsSVG({
  usernames,
  size = 64,
  perRow = 10,
  spacing = 8,
}: GenerateGitHubAvatarsSVGOptions): Promise<string> {
  const rows = Math.ceil(usernames.length / perRow);
  const width = Math.min(usernames.length, perRow) * (size + spacing) - spacing;
  const height = rows * (size + spacing) - spacing;

  const avatarPromises = usernames.map((username) =>
    fetchAvatarAsBase64(username)
  );
  const avatarDataUrls = await Promise.all(avatarPromises);

  return generateAvatarsSVG({
    usernames,
    avatarDataUrls,
    size,
    perRow,
    spacing,
    width,
    height,
  });
}
