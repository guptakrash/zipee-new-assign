interface PaginationProps {
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
  loading?: boolean
}

const Pagination = ({ onNext, onPrevious, hasNext, hasPrevious, loading }: PaginationProps) => {
  return (
    <div className="flex justify-center gap-4 mt-8 mb-8">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious || loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          hasPrevious && !loading
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext || loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          hasNext && !loading
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination

