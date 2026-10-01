/** Only local paths can be used as post-login destinations. */
export function safeCallbackPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x20]/.test(value)) return "/"
  try {
    const url = new URL(value, "https://powerprimeur.com")
    if (url.origin !== "https://powerprimeur.com" || url.pathname === "/connexion") return "/"
    return url.pathname + url.search + url.hash
  } catch { return "/" }
}
