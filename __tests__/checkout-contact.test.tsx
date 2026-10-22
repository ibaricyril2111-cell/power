// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import Checkout from "@/app/commande/page"
const { profile, save, push, replace }=vi.hoisted(()=>({profile:vi.fn(),save:vi.fn(),push:vi.fn(),replace:vi.fn()}))
let query=""
vi.mock("next/navigation",()=>({useRouter:()=>({push,replace}),useSearchParams:()=>new URLSearchParams(query)}))
vi.mock("@/components/layout/header",()=>({default:()=>null}))
vi.mock("@/components/layout/footer",()=>({default:()=>null}))
vi.mock("@/components/cart/cart-artwork",()=>({default:()=>null}))
vi.mock("@/components/delivery/delivery-calendar",()=>({default:({onSelectDelivery}:any)=><button onClick={()=>onSelectDelivery({slotId:"slot",dateISO:"2099-01-01",date:"Demain",time:"09:00 - 10:00"})}>Choisir le créneau</button>}))
vi.mock("@/app/actions/account",()=>({getUserProfile:profile,saveCheckoutContact:save}))
vi.mock("@/app/actions/cart",()=>({getCartItems:async()=>({success:true,data:[{id:"line",quantity:1,product:{name:"Basilic",price:1,unit:"botte"}}]})}))
vi.mock("@/app/actions/content",()=>({getDeliveryConfig:async()=>({fee:4.9,threshold:30})}))
beforeEach(()=>{
  vi.clearAllMocks();query=""
  profile.mockResolvedValue({success:true,data:{}})
  save.mockResolvedValue({success:true})
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue({ok:true,status:200,json:async()=>({success:true,orderId:"order"})}))
  HTMLElement.prototype.scrollIntoView=vi.fn()
})
afterEach(()=>{cleanup();vi.unstubAllGlobals()})
describe("saisie des coordonnées à la commande",()=>{
  it("annonce les manques dans l’ordre du formulaire et place le focus sur le premier",async()=>{
    render(<Checkout/>);await screen.findByText("Récapitulatif")
    expect(within(screen.getByRole("status",{name:"Champs à compléter"})).getAllByRole("button").map(el=>el.textContent)).toEqual([
      "Renseignez votre adresse de livraison.","Renseignez votre code postal.","Renseignez votre ville.","Renseignez votre numéro de téléphone.","Choisissez une date et un créneau disponible."])
    fireEvent.click(screen.getByRole("button",{name:/^Confirmer/}))
    expect(document.activeElement).toBe(screen.getByLabelText("Adresse *"))
    expect(fetch).not.toHaveBeenCalled();expect(save).not.toHaveBeenCalled()
  })
  it("n’exige pas d’adresse pour un retrait et explique le téléphone manquant",async()=>{
    query="mode=retrait";render(<Checkout/>);await screen.findByText("Récapitulatif")
    fireEvent.click(screen.getByRole("button",{name:/^Confirmer/}))
    expect(document.activeElement).toBe(screen.getByLabelText("Téléphone *"))
    expect(screen.queryByLabelText("Adresse *")).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })
  it("enregistre le téléphone en quittant le champ et le reprend au chargement suivant",async()=>{
    let stored={phone:""}
    profile.mockImplementation(async()=>({success:true,data:stored}))
    save.mockImplementation(async data=>{stored={phone:data.phone};return{success:true}})
    const view=render(<Checkout/>);await screen.findByText("Récapitulatif")
    fireEvent.change(screen.getByLabelText("Téléphone *"),{target:{value:"+33 6 12 34 56 78"}})
    fireEvent.blur(screen.getByLabelText("Téléphone *"))
    await screen.findByText("Numéro enregistré dans votre compte.")
    expect(save).toHaveBeenCalledWith({phone:"+33612345678"})
    view.unmount();render(<Checkout/>);await screen.findByText("Récapitulatif")
    expect((screen.getByLabelText("Téléphone *") as HTMLInputElement).value).toBe("+33612345678")
  })
  it("enregistre les coordonnées avant la commande et conserve la saisie si la sauvegarde échoue",async()=>{
    query="mode=retrait";profile.mockResolvedValue({success:true,data:{phone:"0612345678"}})
    save.mockResolvedValueOnce({success:false})
    render(<Checkout/>);await screen.findByText("Récapitulatif")
    fireEvent.click(screen.getByRole("button",{name:"Choisir le créneau"}))
    fireEvent.click(screen.getByRole("button",{name:/^Confirmer/}))
    await screen.findByRole("alert")
    expect(fetch).not.toHaveBeenCalled()
    expect((screen.getByLabelText("Téléphone *") as HTMLInputElement).value).toBe("0612345678")
    save.mockResolvedValue({success:true})
    fireEvent.click(screen.getByRole("button",{name:/^Confirmer/}))
    await waitFor(()=>expect(push).toHaveBeenCalledWith("/checkout/success?order_id=order"))
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string).phone).toBe("0612345678")
  })
})
