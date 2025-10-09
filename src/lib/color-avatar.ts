/**
 * Gera uma cor consistente baseada em uma string (ID ou nome)
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Paleta de cores vibrantes e amigáveis
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#6366f1", // indigo
    "#f97316", // orange
    "#84cc16", // lime
    "#14b8a6", // teal
    "#a855f7", // purple
    "#ef4444", // red
    "#22c55e", // green
    "#eab308", // yellow
    "#0ea5e9", // sky
    "#d946ef", // fuchsia
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
