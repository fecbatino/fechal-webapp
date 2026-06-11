import { getPost, getPosts } from '@/lib/ghost'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-4">
        <Link
          href={'/' + locale + '/blog'}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        {post.feature_image && (
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.feature_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={'/' + locale + '/blog/tag/' + tag.slug}
                className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 hover:text-teal-400 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <time>
            {new Date(post.published_at || post.created_at).toLocaleDateString(
              locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </time>
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-code:text-teal-300 prose-pre:bg-white/10 prose-pre:border prose-pre:border-white/10
            prose-blockquote:border-teal-500 prose-blockquote:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  )
}

export async function generateStaticParams() {
  try {
    const data = await getPosts({ limit: 100 })
    const posts = data.posts || []
    const locales = ['de', 'en', 'fr']
    return posts.flatMap((post) => locales.map((locale) => ({ locale, slug: post.slug })))
  } catch {
    return []
  }
}

export const dynamic = 'force-static'
export const revalidate = 300
