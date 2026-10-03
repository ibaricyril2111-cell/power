// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, render, screen, fireEvent, cleanup } from "@testing-library/react"
import ContactPage from "@/app/contact/page"

const { submit } = vi.hoisted(() => ({ submit: vi.fn() }))
vi.mock("@/app/actions/contact", () => ({ submitContactForm: submit }))
vi.mock("@/components/layout/header", () => ({ default: () => <header /> }))
vi.mock("@/components/layout/footer", () => ({ default: () => <footer /> }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

beforeEach(() => { submit.mockReset() })
afterEach(() => { cleanup(); vi.clearAllMocks() })

const message = "Bonjour, une question pour une commande de fruits."
function fillForm() {
  fireEvent.change(screen.getByLabelText("Nom complet"), { target: { value: "Client test" } })
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "client@example.com" } })
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: message } })
  return screen.getByRole("form", { name: /Envoyer un Message/ })
}

describe("contact POWER", () => {
  it("associe chaque champ à son libellé et ne publie pas une adresse email non vérifiée", () => {
    render(<ContactPage />)
    expect(screen.getByLabelText("Nom complet").getAttribute("autocomplete")).toBe("name")
    expect(screen.getByLabelText("Email").getAttribute("autocomplete")).toBe("email")
    expect(screen.getByLabelText("Sujet")).toBeTruthy()
    expect(screen.getByLabelText("Message")).toBeTruthy()
    expect(screen.getByRole("link", { name: "Ouvrir le formulaire de contact" }).getAttribute("href")).toBe("#contact-form")
    expect(screen.queryByText("contact@power.com")).toBeNull()
    expect(screen.queryByText("power.alfortville@gmail.com")).toBeNull()
  })

  it("empêche un double envoi pendant une requête en cours", async () => {
    let finish: (value: { success: boolean }) => void = () => {}
    submit.mockImplementation(() => new Promise<{ success: boolean }>(resolve => { finish = resolve }))
    render(<ContactPage />)
    const form = fillForm()
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(submit).toHaveBeenCalledTimes(1)
    expect(form.getAttribute("aria-busy")).toBe("true")
    await act(async () => { finish({ success: true }) })
    expect(form.getAttribute("aria-busy")).toBe("false")
  })

  it("conserve le message et affiche l'erreur si le serveur refuse l'envoi", async () => {
    submit.mockResolvedValue({ success: false, error: "Envoi indisponible" })
    render(<ContactPage />)
    fireEvent.submit(fillForm())
    await screen.findByText("Envoi indisponible")
    expect((screen.getByLabelText("Message") as HTMLTextAreaElement).value).toBe(message)
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("client@example.com")
    expect((screen.getByRole("button", { name: "Envoyer le message" }) as HTMLButtonElement).disabled).toBe(false)
  })

  it("conserve les champs après une panne réseau pour permettre une nouvelle tentative", async () => {
    submit.mockRejectedValue(new Error("Réseau indisponible"))
    render(<ContactPage />)
    fireEvent.submit(fillForm())
    await screen.findByText(/Votre message est conservé/)
    expect((screen.getByLabelText("Message") as HTMLTextAreaElement).value).toBe(message)
    expect((screen.getByRole("button", { name: "Envoyer le message" }) as HTMLButtonElement).disabled).toBe(false)
  })

  it("efface les champs uniquement après un envoi confirmé", async () => {
    submit.mockResolvedValue({ success: true })
    render(<ContactPage />)
    fireEvent.submit(fillForm())
    await screen.findByText("Message envoyé avec succès !")
    expect(submit).toHaveBeenCalledWith({ name: "Client test", email: "client@example.com", subject: "Question sur une commande", message })
    expect((screen.getByLabelText("Message") as HTMLTextAreaElement).value).toBe("")
    expect((screen.getByLabelText("Nom complet") as HTMLInputElement).value).toBe("")
  })
})
