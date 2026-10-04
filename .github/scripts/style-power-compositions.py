from pathlib import Path
import hashlib

expected = {
 'composition-card.tsx':'03e85d3d4bad17d2a0b687a786bdff0d24c22b5f',
 'composition-mobile-item.tsx':'1a28f36c6b7ec9f70cc7f66ec292a1413ef9e574',
 'composition-configurator.tsx':'3d8b7e1dc5510fdb05b2759d435bc02204581799',
 'composition-sheet.tsx':'f570a50a65c74dc65c95732826b2008e15faffae',
}
root=Path('components/product')
original={n:(root/n).read_text() for n in expected}
for n,sha in expected.items():
 b=(root/n).read_bytes()
 actual=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
 if actual!=sha: raise RuntimeError('Source changed; refusing to overwrite '+n)

card=original['composition-card.tsx'].replace('import Image from "next/image"','import CompositionArtwork from "@/components/product/composition-artwork"')
a=card.index('                    {composition.imageUrl ? (')
b=card.index('                    {badge}',a)
card=card[:a]+'                    <CompositionArtwork composition={composition} sizes="(max-width: 767px) 90vw, 360px" />\n'+card[b:]
card=card.replace('group glassmorphism bg-zinc-900/40 rounded-[48px] overflow-hidden border border-white/5 hover:border-orange-500/50','group bg-[#0b4938] rounded-[24px] overflow-hidden border border-white/15 hover:border-[#ffcd47]/60')
card=card.replace('relative h-72 overflow-hidden text-left','relative aspect-[4/5] w-full overflow-hidden text-left sm:aspect-square')
card=card.replace('p-8 flex flex-col flex-1','p-5 flex flex-col flex-1').replace('text-2xl font-black uppercase italic mb-3 text-white group-hover:text-orange-500','text-xl font-bold mb-2 text-white group-hover:text-[#ffcd47]')
card=card.replace('text-zinc-500','text-white/70').replace('bg-orange-500 hover:bg-orange-600 text-white','bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d]')

mobile=original['composition-mobile-item.tsx'].replace('import ImageWithFallback from "./image-with-fallback"','import CompositionArtwork from "./composition-artwork"\nimport type { ArtworkIngredient } from "@/lib/power-composition-artwork"')
mobile=mobile.replace('  id: string\n','  id: string\n  type?: string | null\n  options?: readonly ArtworkIngredient[]\n',1)
a=mobile.index('        <ImageWithFallback');b=mobile.index('        />',a)+len('        />')
mobile=mobile[:a]+'        <CompositionArtwork composition={composition} sizes="50vw" />'+mobile[b:]
mobile=mobile.replace('bg-white border border-black/5','bg-[#0b4938] border border-white/15').replace('bg-[#eee9df]','bg-[#0b4938]').replace('text-orange-600','text-[#ffcd47]').replace('text-[#173f32]','text-white').replace('bg-[#173f32] hover:bg-[#225943] text-white','bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d]')

sheet=original['composition-sheet.tsx'].replace('bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d4] text-zinc-900 border-zinc-300','bg-[#073b2d] text-white border-[#ffcd47]/25').replace('text-zinc-900','text-white').replace('max-h-[92vh]','max-h-[92dvh]').replace('max-h-[90vh]','max-h-[90dvh]')

config=original['composition-configurator.tsx'].replace('import Image from "next/image"','import CompositionArtwork from "@/components/product/composition-artwork"')
a=config.index('                    <Image\n');b=config.index('                    />',a)+len('                    />')
config=config[:a]+'''                    <CompositionArtwork
                        composition={composition}
                        selectedOptionIds={options.length > 0 ? selectedOptions : undefined}
                        sizes="(max-width: 767px) 90vw, 360px"
                    />'''+config[b:]
config=config.replace('relative aspect-square rounded-2xl overflow-hidden bg-zinc-200','relative h-[240px] sm:h-[280px] md:h-[340px] rounded-2xl overflow-hidden bg-[#0b4938] border border-white/15')
replacements={
 'bg-orange-500 text-white shadow-lg shadow-orange-500/25':'bg-[#ffcd47] text-[#073b2d] shadow-lg',
 'bg-orange-500 border-orange-500 text-white':'bg-[#ffcd47] border-[#ffcd47] text-[#073b2d]',
 'bg-orange-500 hover:bg-orange-600 text-white':'bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-bold min-h-12 rounded-xl',
 'bg-white/70 hover:bg-white text-zinc-900 border border-zinc-200':'bg-white/5 hover:bg-white/10 text-white border border-white/20',
 'bg-white/60 border-zinc-200 text-zinc-700 hover:bg-white':'bg-white/5 border-white/20 text-white/80 hover:bg-white/10',
 'bg-white/60 border-zinc-200 text-zinc-400':'bg-white/5 border-white/15 text-white/60',
 'bg-green-500/15 border-green-500/40 text-green-800':'bg-[#ffcd47]/15 border-[#ffcd47]/50 text-[#ffe18a]',
 'bg-white/60 border border-zinc-200':'bg-white/5 border border-white/20',
 'bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800':'bg-[#ffcd47]/10 border border-[#ffcd47]/30 p-3 text-sm text-[#ffe18a]',
 'text-zinc-900':'text-white','text-zinc-800':'text-white',
 'text-zinc-600':'text-white/80','text-zinc-500':'text-white/65',
 'text-orange-600':'text-[#ffcd47]','bg-zinc-300':'bg-white/15',
 '"text-white/90" : "text-[#ffcd47]"':'"text-[#073b2d]" : "text-[#ffcd47]"',
 '"text-white/75" : "text-white/65"':'"text-[#073b2d]/80" : "text-white/65"',
 'text-white/85 ml-1':'text-current ml-1',
}
for a,b in replacements.items(): config=config.replace(a,b)
config=config.replace('<QuantitySelector value={quantity}', '<QuantitySelector appearance="power" value={quantity}')
config=config.replace('grid grid-cols-3 gap-2','grid grid-cols-2 sm:grid-cols-3 gap-2')
last=config.rfind('<div className="space-y-3">')
assert last>0
config=config[:last]+config[last:].replace('<div className="space-y-3">','<div className="sticky bottom-0 z-10 space-y-3 rounded-2xl border border-white/15 bg-[#073b2d] p-4">',1)

for name,new in [('composition-card.tsx',card),('composition-configurator.tsx',config)]:
 def logic(s): return s[s.index('export default function'):s.index('\n    return (')]
 assert logic(new)==logic(original[name]), 'Behaviour changed in '+name
for n,t in [('composition-card.tsx',card),('composition-mobile-item.tsx',mobile),('composition-sheet.tsx',sheet),('composition-configurator.tsx',config)]:
 assert 'bg-orange-500' not in t and 'from-[#f5f0e8]' not in t, n
 assert 'composition.basePrice' in t or n=='composition-sheet.tsx'
 (root/n).write_text(t)
print('Updated four composition views only. Existing pricing and selection control flow preserved.')
