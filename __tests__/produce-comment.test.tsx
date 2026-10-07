// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import ProduceComment from "@/components/product/produce-comment"
import { produceNoteForName } from "@/lib/power-produce-notes"

afterEach(cleanup)

describe("Descriptifs produits POWER", () => {
  it.each([null, "", " Mangue Avion ", "Mangue Avion sélectionné par Power Primeur à Alfortville."])("remplace seulement les textes vides ou automatiques : %s", description => {
    render(<ProduceComment name="Mangue Avion" description={description} />)
    expect(screen.getByText(produceNoteForName("Mangue Avion")!.comment)).toBeTruthy()
    expect(screen.getByText(/^Saison :/)).toBeTruthy()
  })

  it("préserve le descriptif saisi par le magasin", () => {
    render(<ProduceComment name="Mangue Avion" description="Arrivage du jour, à déguster bien mûre." />)
    expect(screen.getByText("Arrivage du jour, à déguster bien mûre.")).toBeTruthy()
  })

  it("ne supprime pas le texte d’un produit encore sans fiche éditoriale", () => {
    render(<ProduceComment name="Mirabelle" description="Mirabelle" />)
    expect(screen.getByText("Mirabelle")).toBeTruthy()
    expect(screen.queryByText(/^Saison :/)).toBeNull()
  })

  it("ajoute le commentaire aux variétés de laitue déjà présentes en boutique", () => {
    render(<ProduceComment name="Sachet Romaine" />)
    expect(screen.getByText(produceNoteForName("Laitue")!.comment)).toBeTruthy()
  })
})
