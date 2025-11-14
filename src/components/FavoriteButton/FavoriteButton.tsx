import { useFavorites } from '../../context/FavoritesContext'

interface FavoriteButtonProps {
  characterUrl: string
  size?: 'sm' | 'md' | 'lg'
}

const FavoriteButton = ({ characterUrl, size = 'md' }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(characterUrl)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(characterUrl)
      }}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all hover:scale-110 ${
        favorite
          ? 'bg-red-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900'
      }`}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`}
        fill={favorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}

export default FavoriteButton

