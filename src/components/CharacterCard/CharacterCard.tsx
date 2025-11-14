import { getSpeciesColor } from '../../utils/getSpeciesColor'
import FavoriteButton from '../FavoriteButton/FavoriteButton'

interface CharacterCardProps {
  name: string
  speciesName: string | null
  imageUrl: string
  characterUrl: string
  onClick: () => void
  viewMode?: 'grid' | 'list'
}

const CharacterCard = ({ name, speciesName, imageUrl, characterUrl, onClick, viewMode = 'grid' }: CharacterCardProps) => {
  const accentColor = getSpeciesColor(speciesName)

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-xl flex items-center gap-4 p-4"
      >
        <div className={`w-2 h-full ${accentColor} rounded-l-lg`}></div>
        <img
          src={imageUrl}
          alt={name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white truncate">{name}</h3>
          {speciesName && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{speciesName}</p>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton characterUrl={characterUrl} size="md" />
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl relative"
    >
      <div className={`h-2 ${accentColor}`}></div>
      <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton characterUrl={characterUrl} size="sm" />
      </div>
      <div className="p-4">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h3>
        {speciesName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{speciesName}</p>
        )}
      </div>
    </div>
  )
}

export default CharacterCard

