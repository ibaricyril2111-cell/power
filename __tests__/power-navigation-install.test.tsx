// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import PwaRegister from "@/components/pwa-register"
import Header from "@/components/layout/header"
import MobileBottomNav from "@/components/layout/mobile-bottom-nav"

vi.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }))
vi.mock("@/app/actions/cart", () => ({ getCartItems: vi.fn().mockResolvedValue({ success: true, data: [] }) }))
vi.mock("@/app/actions/account", () => ({ getUserProfile: vi.fn() }))
vi.mock("@/components/cart/cart-drawer", () => ({ default: () => null }))
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }))

const KEY = "power:install-prompt-dismissed-until"
const WEEK = 7 * 24 * 60 * 60 * 1000
const installEvent = () => {
  const event = new Event("beforeinstallprompt", { cancelable: true })
  fireEvent(window, event)
  return event
}

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }))
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Chrome Desktop")
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("readable POWER navigation", () => {
  it("uses opaque backgrounds without blurring the product photos beneath", () => {
    render(<><Header /><MobileBottomNav /></>)
    const header = screen.getByRole("banner")
    const mobile = screen.getByRole("navigation", { name: "Navigation principale" })
    for (const element of [header, mobile]) {
      expect(element.classList.contains("bg-[#073b2d]")).toBe(true)
      expect(element.className).not.toContain("backdrop-blur")
      expect(element.className).not.toContain("/98")
    }
    const categories = screen.getByRole("navigation", { name: "Catégories POWER" })
    expect(within(categories).getByRole("link", { name: "100 mascottes" }).getAttribute("href")).toBe("/personnages")
  })
})

describe("installation suggestions respect dismissal", () => {
  it("remembers closing the banner across page reloads for seven days", () => {
    const first = render(<PwaRegister />)
    expect(installEvent().defaultPrevented).toBe(true)
    expect(screen.getByRole("complementary")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Fermer" }))
    expect(Number(localStorage.getItem(KEY))).toBe(Date.now() + WEEK)
    first.unmount()
    render(<PwaRegister />)
    expect(installEvent().defaultPrevented).toBe(true)
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("does not reopen after another browser install event on the same page", () => {
    render(<PwaRegister />)
    installEvent()
    fireEvent.click(screen.getByRole("button", { name: "Fermer" }))
    installEvent()
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("respects a saved dismissal on iPhone too", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("iPhone")
    localStorage.setItem(KEY, String(Date.now() + WEEK))
    render(<PwaRegister />)
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("allows the suggestion again after the dismissal expires", () => {
    localStorage.setItem(KEY, String(Date.now() - 1))
    render(<PwaRegister />)
    installEvent()
    expect(screen.getByRole("complementary")).toBeTruthy()
  })

  it("cancels the delayed mobile banner when closed", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("iPhone")
    render(<PwaRegister />)
    installEvent()
    fireEvent.click(screen.getByRole("button", { name: "Fermer" }))
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("never reopens the delayed banner after installation", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("iPhone")
    render(<PwaRegister />)
    fireEvent(window, new Event("appinstalled"))
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("does not interrupt shopping if saved preferences cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Storage blocked") })
    render(<PwaRegister />)
    installEvent()
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("clears the mobile timer when leaving the page", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("iPhone")
    const view = render(<PwaRegister />)
    expect(vi.getTimerCount()).toBe(1)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
