import { useEffect, useState } from 'react'
import { Character, Planet } from '../../services/api'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'
import { convertHeight } from '../../utils/convertHeight'
import Loader from '../Loader/Loader'

interface CharacterModalProps {
  character: Character
  onClose: () => void
  onCompare?: (character: Character) => void
}

const CharacterModal = ({ character, onClose, onCompare }: CharacterModalProps) => {
  const [planet, setPlanet] = useState<Planet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        setLoading(true)
        const planetData = await api.fetchPlanet(character.homeworld)
        setPlanet(planetData)
      } catch (err) {
        setError('Failed to load planet details')
      } finally {
        setLoading(false)
      }
    }

    fetchPlanet()
  }, [character.homeworld])

  const filmCount = character.films.length

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{character.name}</h2>
          <div className="flex gap-2 items-center">
            {onCompare && (
              <button
                onClick={() => {
                  onCompare(character)
                  onClose()
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Compare
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Height</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{convertHeight(character.height)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mass</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{character.mass} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Birth Year</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{character.birth_year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date Added</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{formatDate(character.created)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Film Count</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{filmCount}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Homeworld</h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 dark:text-red-400">{error}</p>
            ) : planet ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{planet.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Terrain</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{planet.terrain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Climate</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{planet.climate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Population</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{planet.population}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterModal

