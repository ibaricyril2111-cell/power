import { beforeEach, describe, expect, it, vi } from "vitest"
const { auth, update, findUnique, avatar } = vi.hoisted(() => ({auth:vi.fn(),update:vi.fn(),findUnique:vi.fn(),avatar:vi.fn()}))
vi.mock("@/auth", () => ({auth}))
vi.mock("@/lib/db", () => ({prisma:{user:{update,findUnique},siteSetting:{findUnique:avatar}}}))
import { saveCheckoutContact, getUserProfile, updateUserProfile } from "@/app/actions/account"

beforeEach(() => {
  vi.clearAllMocks()
  auth.mockResolvedValue({user:{id:"self"}})
  update.mockImplementation(async ({data})=>({id:"self",...data}))
  avatar.mockResolvedValue(null)
})
describe("coordonnées du compte", () => {
  it("sauvegarde uniquement les coordonnées sur le compte de la session puis les relit dans le profil", async () => {
    let stored={id:"self",phone:null as string|null,address:null as string|null}
    update.mockImplementation(async ({data})=>(stored={...stored,...data}))
    findUnique.mockImplementation(async()=>stored)
    expect((await saveCheckoutContact({phone:"+33 6 12 34 56 78",address:"  Rue des Lilas  ",userId:"other",role:"admin"} as any)).success).toBe(true)
    expect(update).toHaveBeenCalledWith(expect.objectContaining({where:{id:"self"},data:{phone:"+33612345678",address:"Rue des Lilas"}}))
    expect((await getUserProfile()).data?.phone).toBe("+33612345678")
    expect((await getUserProfile()).data?.address).toBe("Rue des Lilas")
  })
  it("utilise la même normalisation depuis la modification du profil", async () => {
    await updateUserProfile({phone:"06 12 34 56 78"})
    expect(update).toHaveBeenCalledWith(expect.objectContaining({where:{id:"self"},data:expect.objectContaining({phone:"0612345678"})}))
  })
  it.each([null,{user:{id:"self",disabled:true}}])("refuse une session absente ou désactivée", async session => {
    auth.mockResolvedValue(session)
    expect((await saveCheckoutContact({phone:"0612345678"})).success).toBe(false)
    expect(update).not.toHaveBeenCalled()
  })
  it.each(["", "0612", "abc", "1234567890123456"])("ne sauvegarde pas un numéro invalide : %s", async phone => {
    expect((await saveCheckoutContact({phone})).success).toBe(false)
    expect(update).not.toHaveBeenCalled()
  })
})
