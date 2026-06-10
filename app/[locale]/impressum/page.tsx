import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | Fechal Batakpale',
}

export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Angaben gemäß § 5 TMG
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-700 leading-relaxed">
          <p className="font-semibold text-gray-900">Fechal Batakpale</p>
          <p>Sigelsdorfer Str. 34</p>
          <p>90431 Nürnberg</p>
          <p>Deutschland</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Kontakt
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 text-gray-700">
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 flex-shrink-0">E-Mail</span>
            <a
              href="mailto:fecbatino@gmail.com"
              className="text-emerald-600 hover:underline"
            >
              fecbatino@gmail.com
            </a>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 flex-shrink-0">Webseite</span>
            <a
              href="https://fechal-batakpale.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline break-all"
            >
              fechal-batakpale.com
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-700 leading-relaxed">
          <p className="font-semibold text-gray-900">Fechal Batakpale</p>
          <p>Sigelsdorfer Str. 34</p>
          <p>90431 Nürnberg</p>
        </div>
      </section>
    </div>
  )
}
