import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz | Fechal Batakpale',
}

const sections = [
  {
    id: 'allgemein',
    title: '1. Allgemeine Hinweise',
    content: (
      <p>
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
        personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
        Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </p>
    ),
  },
  {
    id: 'hosting',
    title: '2. Hosting',
    content: (
      <p>
        Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website
        erfasst werden, werden auf den Servern des Hosters gespeichert.
        <br /><br />
        <span className="font-medium text-gray-800">Hoster:</span>{' '}
        Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland.
      </p>
    ),
  },
  {
    id: 'newsletter',
    title: '3. Newsletter & E-Mails',
    content: (
      <p>
        Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von
        Ihnen eine E-Mail-Adresse. Wir nutzen für den Versand{' '}
        <span className="font-medium text-gray-800">Gmail (Google)</span> als SMTP-Dienstleister.
        Ihre Daten werden ausschließlich für den Versand der angeforderten Informationen verwendet.
      </p>
    ),
  },
  {
    id: 'verantwortlich',
    title: 'Verantwortliche Stelle',
    content: (
      <div className="space-y-1">
        <p className="font-medium text-gray-800">Fechal Batakpale</p>
        <p>Sigelsdorfer Str. 34</p>
        <p>90431 Nürnberg</p>
        <p>Deutschland</p>
        <p className="pt-2">
          E-Mail:{' '}
          <a href="mailto:fecbatino@gmail.com" className="text-emerald-600 hover:underline">
            fecbatino@gmail.com
          </a>
        </p>
      </div>
    ),
  },
]

export default function DatenschutzPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
      <p className="text-gray-400 text-sm mb-10">Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}</p>

      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s.id} className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-3">{s.title}</h2>
            <div className="text-gray-600 leading-relaxed text-sm">{s.content}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
