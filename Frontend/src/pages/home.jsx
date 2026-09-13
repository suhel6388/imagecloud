import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Search, Loader2, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react'
import PostCard from '../components/Postcard'

// Change this to your real endpoint (must return { post: [...] }).
const POSTS_ENDPOINT = 'http://localhost:3000/posts'

const POSTS_PER_PAGE = 6

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(POSTS_ENDPOINT)
        const data = res.data
        // API returns: { message, post: [...] }
        const list = Array.isArray(data?.post) ? data.post : []

        if (isMounted) setPosts(list)
      } catch (err) {
        console.error('Failed to fetch posts:', err)
        if (isMounted) setError('Could not load posts. Please try again later.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPosts()
    return () => {
      isMounted = false
    }
  }, [])

  // Reset to page 1 whenever the search query changes.
  useEffect(() => {
    setPage(1)
  }, [search])

  const filteredPosts = useMemo(() => {
    const safePosts = Array.isArray(posts) ? posts : []
    const query = search.trim().toLowerCase()
    if (!query) return safePosts
    return safePosts.filter((post) => {
      const haystack = `${post.caption || ''}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [posts, search])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(start, start + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Posts</h1>
          <p className="text-slate-500 mt-1">Browse, search, and download shared posts.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by caption..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading posts...</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-sm">
              {search ? 'No posts match your search.' : 'No posts yet.'}
            </span>
          </div>
        )}
        {/* Grid of cards */}
        {!loading && !error && paginatedPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post._id}
                imageUrl={post.image}
                description={post.caption}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredPosts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => goToPage(num)}
                className={`h-9 min-w-9 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  num === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home