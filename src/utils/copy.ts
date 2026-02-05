export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {}
}
