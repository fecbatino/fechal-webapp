import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <span>© {new Date().getFullYear()} Fechal Batakpale</span>
        <div className="flex items-center gap-4">
          <Link href="/impressum" className="hover:text-emerald-600 transition-colors">
            Impressum
          </Link>
          <span className="text-gray-200">·</span>
          <Link href="/datenschutz" className="hover:text-emerald-600 transition-colors">
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  )
}
