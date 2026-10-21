/** Same readable price treatment on every card, outside the photograph. */
export default function ProductPrice({ price, promoPrice, unit, from = false }: {
  price: number; promoPrice?: number | null; unit?: string; from?: boolean
}) {
  return <p data-product-price className="mt-2 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 bg-transparent text-[#ffcd47]">
    {promoPrice != null && <del className="text-xs text-white/70">{price.toFixed(2)} €</del>}
    <span className="text-base font-black">{from ? "Dès " : ""}{(promoPrice ?? price).toFixed(2)} €</span>
    {unit && <span className="break-words text-xs text-white/70">/ {unit}</span>}
  </p>
}
