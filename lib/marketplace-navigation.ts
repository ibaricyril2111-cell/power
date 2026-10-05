/** Display/navigation only. No product, price or stock changes. */
export function readMarketplaceTab(search: string): string {
  const value = new URLSearchParams(search).get("rayon") || "tout"
  return /^[a-z0-9-]{1,80}$/.test(value) ? value : "tout"
}

export function marketplaceHref(tab = "tout"): string {
  const safeTab = /^[a-z0-9-]{1,80}$/.test(tab) ? tab : "tout"
  return `/?rayon=${encodeURIComponent(safeTab)}#marketplace`
}

/** Works both on the homepage and from product/contact/cart pages. */
export function openMarketplace(tab = "tout"): void {
  const target = document.getElementById("marketplace")
  const href = marketplaceHref(tab)
  if (!target) {
    window.location.assign(href)
    return
  }
  window.history.pushState(null, "", href)
  window.dispatchEvent(new CustomEvent("marketplace-tab", { detail: readMarketplaceTab(window.location.search) }))
  target.scrollIntoView({ behavior: "smooth", block: "start" })
}
