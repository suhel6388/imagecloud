import { useRef, useState } from 'react'
import { ImageIcon, UploadCloud, X, Send } from 'lucide-react'
import axios from 'axios'
import toast,{ Toaster } from "react-hot-toast";
const MAX_SIZE_MB = 5
const MAX_CAPTION_LEN = 500
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

// Change this to your real endpoint.
const POST_ENDPOINT = 'http://localhost:3000/create-post'

export default function CreatePost() {
  const [image, setImage] = useState(null) // { file, previewUrl }
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setError('')

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a PNG, JPG, or WEBP image.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`)
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setImage({ file, previewUrl })
  }

  const onInputChange = (e) => {
    handleFile(e.target.files?.[0])
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  const removeImage = () => {
    if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl)
    setImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!image) {
      setError('Please add an image before posting.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      toast.loading('Uploading file')
      const formData = new FormData()
      formData.append('image', image.file)
      formData.append('caption', caption)

      const res = await axios.post(POST_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

     
      console.log(res.message);
      toast.success(res.message)

      setSubmitted(true)
      removeImage()
      setCaption('')
      setTimeout(() => setSubmitted(false), 2500)
    } catch (err) {
      console.error(err)
      setError('Something went wrong while posting. Please try again.')
    } finally {
      setSubmitting(false)
      toast.dismiss()
      toast.success("Post Created Succesfully!..")
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-10 right-0 h-72 w-72 rounded-full bg-blue-200/60 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 -left-16 h-80 w-80 rounded-full bg-blue-200/50 blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 left-10 h-24 w-24 rounded-full bg-blue-100" />
      <Toaster
  position="top-left"
  reverseOrder={false}
/>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8"
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <ImageIcon className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Create a Post</h1>
            <p className="text-slate-500 text-sm mt-1">Upload an image and add a caption to share.</p>
          </div>
        </div>

        {/* Image label */}
        <label htmlFor="post-image" className="block text-sm font-semibold text-slate-900 mb-2">
          Image
        </label>

        {/* Dropzone */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="w-full rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-50 transition-colors py-10 flex flex-col items-center justify-center gap-3 mb-4"
        >
          <UploadCloud className="h-10 w-10 text-blue-500" strokeWidth={1.75} />
          <span className="text-blue-600 font-semibold">Click to upload an image</span>
          <span className="text-xs text-slate-400">PNG, JPG, WEBP (Max {MAX_SIZE_MB}MB)</span>
        </button>
        <input
          id="post-image"
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={onInputChange}
        />

        {error && <p className="text-sm text-red-500 mb-4 -mt-2">{error}</p>}

        {/* Preview */}
        {image && (
          <div className="relative mb-6 rounded-xl overflow-hidden group">
            <img
              src={image.previewUrl}
              alt="Upload preview"
              className="w-full h-44 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-slate-800/70 hover:bg-slate-900/80 flex items-center justify-center text-white transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Caption */}
        <label htmlFor="post-caption" className="block text-sm font-semibold text-slate-900 mb-2">
          Caption
        </label>
        <textarea
          id="post-caption"
          name="caption"
          value={caption}
          maxLength={MAX_CAPTION_LEN}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write something about this image..."
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
        <div className="text-right text-xs text-slate-400 mt-1 mb-6">
          {caption.length}/{MAX_CAPTION_LEN}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3.5 transition-colors shadow-sm shadow-blue-300"
        >
          <Send className="h-4 w-4" strokeWidth={2.25} />
          {submitting ? 'Posting...' : submitted ? 'Posted!' : 'Submit Post'}
        </button>
      </form>
    </div>
  )
}