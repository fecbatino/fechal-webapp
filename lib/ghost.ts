export interface GhostPost {
  id: string
  uuid: string
  title: string
  slug: string
  html: string
  feature_image: string | null
  featured: boolean
  visibility: string
  created_at: string
  published_at: string
  updated_at: string
  custom_excerpt: string | null
  excerpt?: string
  tags: GhostTag[]
  primary_tag?: GhostTag | null
  primary_author?: GhostAuthor
  url?: string
}

export interface GhostTag {
  id: string
  name: string
  slug: string
  description: string | null
  feature_image: string | null
  visibility: string
  accent_color: string | null
  url: string
}

export interface GhostAuthor {
  id: string
  name: string
  slug: string
  profile_image: string | null
  bio: string | null
  website: string | null
  url: string
}

export interface GhostPostsResponse {
  posts: GhostPost[]
  meta?: { pagination: { page: number; pages: number; total: number; limit: number } }
}

export interface GhostTagsResponse {
  tags: GhostTag[]
}

const GHOST_API_URL = process.env.GHOST_API_URL || 'https://blog.fechal-batakpale.com'
const GHOST_CONTENT_KEY = process.env.GHOST_CONTENT_KEY || ''

async function ghostFetch<T>(endpoint: string): Promise<T> {
  const url = GHOST_API_URL + '/ghost/api/content/' + endpoint + '&key=' + GHOST_CONTENT_KEY
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Ghost API error: ' + res.status + ' ' + res.statusText)
  return res.json()
}

export async function getPosts(options?: { limit?: number; page?: number }): Promise<GhostPostsResponse> {
  const limit = options?.limit || 10
  const page = options?.page || 1
  return ghostFetch<GhostPostsResponse>('posts/?limit=' + limit + '&page=' + page + '&include=tags,authors')
}

export async function getPost(slug: string): Promise<GhostPost | null> {
  try {
    const data = await ghostFetch<GhostPostsResponse>('posts/slug/' + slug + '/?include=tags,authors')
    return data.posts?.[0] || null
  } catch {
    return null
  }
}

export async function getFeaturedPosts(limit = 3): Promise<GhostPost[]> {
  const data = await ghostFetch<GhostPostsResponse>('posts/?filter=featured:true&limit=' + limit + '&include=tags,authors')
  return data.posts || []
}

export async function getTags(): Promise<GhostTag[]> {
  const data = await ghostFetch<GhostTagsResponse>('tags/?limit=50&include=')
  return data.tags || []
}

export async function getPostsByTag(tagSlug: string, options?: { limit?: number }): Promise<GhostPostsResponse> {
  const limit = options?.limit || 10
  return ghostFetch<GhostPostsResponse>('posts/?filter=tags.slug:' + tagSlug + '&limit=' + limit + '&include=tags,authors')
}
