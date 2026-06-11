'use client'

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Daten konnten nicht geladen werden</h2>
        <p className="text-gray-400 text-sm mb-6">
          Die Verbindung zur Datenbank war nicht erfolgreich. Bitte versuche es erneut.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}