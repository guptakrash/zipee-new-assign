interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-red-500 text-xl font-semibold mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState

