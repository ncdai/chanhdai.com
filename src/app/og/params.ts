export function clampParam(
  value: string | null,
  maxLength: number,
  fallback = ""
) {
  if (!value) {
    return fallback
  }
  const trimmed = value.trim()
  return trimmed.length > maxLength
    ? `${trimmed.slice(0, maxLength - 1)}…`
    : trimmed
}
