import { Loader2, ShoppingCart } from "lucide-react"

/** One centred group, with no asymmetric icon margins or baseline offset. */
export default function CartButtonContent({ loading = false, hideIcon = false, children }: {
  loading?: boolean
  hideIcon?: boolean
  children: React.ReactNode
}) {
  const Icon = loading ? Loader2 : ShoppingCart
  return (
    <span data-cart-button-content className="inline-flex max-w-full items-center justify-center gap-2 text-center leading-tight">
      {!hideIcon && <Icon aria-hidden="true" className={"!h-5 !w-5 shrink-0 " + (loading ? "animate-spin" : "")} />}
      <span>{children}</span>
    </span>
  )
}
