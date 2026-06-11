export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Header skeleton */}
        <div className="mb-16">
          <div className="h-4 w-20 bg-white/5 rounded-full mb-3 animate-pulse" />
          <div className="h-10 w-48 bg-white/10 rounded-lg mb-3 animate-pulse" />
          <div className="h-5 w-72 bg-white/5 rounded-lg animate-pulse" />
        </div>

        {/* Projects skeleton */}
        <div className="mb-20">
          <div className="h-6 w-32 bg-white/10 rounded-lg mb-8 animate-pulse" />
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 bg-white/5 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <div className="h-28 bg-white/5 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-16 bg-white/5 rounded-md animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills skeleton */}
        <div className="mb-20">
          <div className="h-6 w-28 bg-white/10 rounded-lg mb-8 animate-pulse" />
          <div className="glass-card rounded-2xl p-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-6">
                <div className="h-4 w-24 bg-white/10 rounded-full mb-3 animate-pulse" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-7 w-20 bg-white/5 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CV skeleton */}
        <div>
          <div className="h-6 w-24 bg-white/10 rounded-lg mb-8 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1 glass-card rounded-xl p-5 space-y-2">
                  <div className="h-5 w-1/2 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}