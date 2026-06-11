import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950 mt-auto py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-sm text-gray-500">
          © {new Date().getFullYear()} Fechal Batakpale
        </span>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/impressum" className="text-gray-500 hover:text-teal-400 transition-colors">
            Impressum
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/datenschutz" className="text-gray-500 hover:text-teal-400 transition-colors">
            Datenschutz
          </Link>
          <span className="text-gray-700">·</span>
          <a
            href="https://github.com/fecbatino"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}