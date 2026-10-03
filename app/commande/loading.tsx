export default function CommandeLoading() {
  return (
    <div className="min-h-screen bg-[#102e25] px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="h-8 w-48 bg-[#244f40] rounded-lg animate-pulse" />

        {/* Form skeleton */}
        <div className="bg-[#173f32] border border-white/10 rounded-2xl p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-[#244f40] rounded animate-pulse" />
              <div className="h-12 bg-[#244f40] rounded-xl animate-pulse" />
            </div>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="bg-[#173f32] border border-white/10 rounded-2xl p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-[#244f40] rounded animate-pulse" />
              <div className="h-4 w-16 bg-[#244f40] rounded animate-pulse" />
            </div>
          ))}
          <div className="h-12 bg-[#244f40] rounded-xl animate-pulse mt-4" />
        </div>
      </div>
    </div>
  )
}
