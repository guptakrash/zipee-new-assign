import { Character } from '../../services/api'
import { convertHeight } from '../../utils/convertHeight'
import { formatDate } from '../../utils/formatDate'

interface CharacterComparisonProps {
  character1: Character | null
  character2: Character | null
  onClose: () => void
}

const CharacterComparison = ({ character1, character2, onClose }: CharacterComparisonProps) => {
  if (!character1 || !character2) return null

  const compareValue = (val1: string, val2: string, isNumeric = false) => {
    if (isNumeric) {
      const num1 = parseFloat(val1) || 0
      const num2 = parseFloat(val2) || 0
      if (num1 > num2) return { winner: 1, diff: num1 - num2 }
      if (num2 > num1) return { winner: 2, diff: num2 - num1 }
      return { winner: 0, diff: 0 }
    }
    return { winner: 0, diff: 0 }
  }

  const heightComparison = compareValue(character1.height, character2.height, true)
  const massComparison = compareValue(character1.mass, character2.mass, true)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Character Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Header */}
            <div className="font-semibold text-gray-700 dark:text-gray-300">Attribute</div>
            <div className="font-semibold text-gray-700 dark:text-gray-300 text-center">{character1.name}</div>
            <div className="font-semibold text-gray-700 dark:text-gray-300 text-center">{character2.name}</div>

            {/* Name */}
            <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
            <div className="text-center">{character1.name}</div>
            <div className="text-center">{character2.name}</div>

            {/* Height */}
            <div className="text-sm text-gray-600 dark:text-gray-400">Height</div>
            <div className={`text-center ${heightComparison.winner === 1 ? 'text-green-600 dark:text-green-400 font-semibold' : ''}`}>
              {convertHeight(character1.height)}
              {heightComparison.winner === 1 && ' ✓'}
            </div>
            <div className={`text-center ${heightComparison.winner === 2 ? 'text-green-600 dark:text-green-400 font-semibold' : ''}`}>
              {convertHeight(character2.height)}
              {heightComparison.winner === 2 && ' ✓'}
            </div>

            {/* Mass */}
            <div className="text-sm text-gray-600 dark:text-gray-400">Mass</div>
            <div className={`text-center ${massComparison.winner === 1 ? 'text-green-600 dark:text-green-400 font-semibold' : ''}`}>
              {character1.mass} kg
              {massComparison.winner === 1 && ' ✓'}
            </div>
            <div className={`text-center ${massComparison.winner === 2 ? 'text-green-600 dark:text-green-400 font-semibold' : ''}`}>
              {character2.mass} kg
              {massComparison.winner === 2 && ' ✓'}
            </div>

            {/* Birth Year */}
            <div className="text-sm text-gray-600 dark:text-gray-400">Birth Year</div>
            <div className="text-center">{character1.birth_year}</div>
            <div className="text-center">{character2.birth_year}</div>

            {/* Film Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">Film Count</div>
            <div className="text-center">{character1.films.length}</div>
            <div className="text-center">{character2.films.length}</div>

            {/* Date Added */}
            <div className="text-sm text-gray-600 dark:text-gray-400">Date Added</div>
            <div className="text-center">{formatDate(character1.created)}</div>
            <div className="text-center">{formatDate(character2.created)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterComparison

