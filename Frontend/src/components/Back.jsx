import { ChevronLeft} from 'lucide-react'

const Back = ({ onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 text-sm shadow-sm shadow-blue-300 transition-colors ${className}` }
    >
      <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
      Back
    </button>
  )
}

export default Back