import { getTranslations } from 'next-intl/server'
import { getPosts, getTags } from '@/lib/ghost'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const data = await getPosts({ limit: 50 })
  const tags = await getTags()
  const posts = data.posts || []

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-400 mb-10">{t('description')}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={'/' + locale + '/blog/tag/' + tag.slug}
                className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 hover:border-teal-500/50 hover:text-teal-400 transition-all"
                style={tag.accent_color ? { borderColor: tag.accent_color + '40', color: tag.accent_color } : {}}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={'/' + locale + '/blog/' + post.slug}
                className="group backdrop-blur-sm bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                {post.feature_image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.feature_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-xl font-semibold mb-2 group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-gray-400 line-clamp-3">
                    {post.custom_excerpt || post.excerpt || ''}
                  </p>

                  <time className="text-xs text-gray-500 mt-3 block">
                    {new Date(post.published_at || post.created_at).toLocaleDateString(
                      locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('empty')}</p>
          </div>
        )}
      </div>
    </main>
  )
}

export const dynamic = 'force-static'
export const revalidate = 300
