import { getTranslations } from 'next-intl/server'
import { getPosts } from '@/lib/ghost'
import { Link } from '@/lib/navigation'
import Image from 'next/image'

interface Props {
  locale: string
}

export default async function BlogPreview({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' })
  const data = await getPosts({ limit: 3 })
  const posts = data.posts || []

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-20 px-4">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 mb-3">
            ✦ {t('blog_preview_title')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('blog_preview_title')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('blog_preview_desc')}
          </p>
        </div>

        {/* Blog cards */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={'/blog/' + post.slug}
                className="group glass-card rounded-2xl overflow-hidden"
              >
                {post.feature_image ? (
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      src={post.feature_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-br from-teal-900/30 to-emerald-900/30 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(20,184,166,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      <line x1="8" y1="7" x2="16" y2="7" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                )}

                <div className="p-5">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-medium">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {post.custom_excerpt || post.excerpt || ''}
                  </p>

                  <time className="text-xs text-gray-500">
                    {new Date(post.published_at || post.created_at).toLocaleDateString(
                      locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-SA' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
              <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(20,184,166,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6v6l4 2" />
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <p className="text-gray-400">{t('blog_preview_empty')}</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all text-sm font-medium"
          >
            {t('blog_preview_cta')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}