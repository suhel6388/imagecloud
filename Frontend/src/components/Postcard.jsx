import { useState } from 'react'
import { Copy, Check, Download, ImageOff } from 'lucide-react'

/**
 * Reusable card that displays a posted image + description.
 * Lets the user copy the image URL and download the file.
 *
 * Props:
 * - imageUrl   (string, required) - the image src / URL to display, copy, and download
 * - description (string) - caption/description text shown under the image
 * - fileName   (string) - filename to use when downloading (defaults derived from URL)
 * - title      (string) - optional small heading above the description
 */
export default function PostCard({ imageUrl, description, fileName, title }) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    setDownloading(true)
    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName || deriveFileName(imageUrl)
      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Failed to download image:', err)
      // Fallback: open the image in a new tab so the user can save it manually.
      window.open(imageUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md shadow-slate-200/70 overflow-hidden border border-slate-100">
      {/* Image */}
      <div className="relative aspect-video bg-slate-100">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title || 'Post image'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-xs">Image unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {title && <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>}

        {description && (
          <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
        )}

        {/* URL row */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={imageUrl || ''}
            onFocus={(e) => e.target.select()}
            className="flex-1 min-w-0 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 truncate focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy image URL"
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
            ) : (
              <Copy className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading || !imageUrl}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 text-sm transition-colors"
        >
          <Download className="h-4 w-4" strokeWidth={2.25} />
          {downloading ? 'Downloading...' : 'Download image'}
        </button>
      </div>
    </div>
  )
}

function deriveFileName(url) {
  try {
    const { pathname } = new URL(url)
    const parts = pathname.split('/')
    const last = parts[parts.length - 1]
    return last || 'download'
  } catch {
    return 'download'
  }
}