import { useState, useEffect, useMemo } from 'react'
import { SWAPIResponse, Character } from '../services/api'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import { useTheme } from '../context/ThemeContext'
import CharacterCard from '../components/CharacterCard/CharacterCard'
import CharacterModal from '../components/CharacterModal/CharacterModal'
import CharacterComparison from '../components/CharacterComparison/CharacterComparison'
import Pagination from '../components/Pagination/Pagination'
import Loader from '../components/Loader/Loader'
import ErrorState from '../components/ErrorState/ErrorState'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'

interface CharacterWithSpecies extends Character {
  speciesName: string | null
  imageUrl: string
  homeworldName: string | null
  filmNames: string[]
}

type SortOption = 'name' | 'height' | 'mass' | 'films'
type ViewMode = 'grid' | 'list'
type ViewType = 'all' | 'favorites' | 'recent'

const Home = () => {
  const { logout } = useAuth()
  const { favorites, isFavorite } = useFavorites()
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed()
  
  const [characters, setCharacters] = useState<CharacterWithSpecies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string>('https://swapi.dev/api/people/')
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [previousUrl, setPreviousUrl] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [compareCharacter1, setCompareCharacter1] = useState<Character | null>(null)
  const [compareCharacter2, setCompareCharacter2] = useState<Character | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterHomeworld, setFilterHomeworld] = useState<string>('')
  const [filterFilm, setFilterFilm] = useState<string>('')
  const [filterSpecies, setFilterSpecies] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [viewType, setViewType] = useState<ViewType>('all')
  const [availableHomeworlds, setAvailableHomeworlds] = useState<{ url: string; name: string }[]>([])
  const [availableFilms, setAvailableFilms] = useState<{ url: string; name: string }[]>([])
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([])

  const fetchCharacters = async (url: string) => {
    try {
      setLoading(true)
      setError(null)
      const response: SWAPIResponse<Character> = await api.fetchCharacters(url)
      
      setNextUrl(response.next)
      setPreviousUrl(response.previous)

      const charactersWithSpecies = await Promise.all(
        response.results.map(async (character) => {
          let speciesName: string | null = null
          let homeworldName: string | null = null
          const filmNames: string[] = []
          
          if (character.species.length > 0) {
            try {
              const species = await api.fetchSpecies(character.species[0])
              speciesName = species.name
            } catch {
              speciesName = null
            }
          }

          try {
            const planet = await api.fetchPlanet(character.homeworld)
            homeworldName = planet.name
          } catch {
            homeworldName = null
          }

          try {
            const filmPromises = character.films.slice(0, 3).map(url => api.fetchFilm(url))
            const films = await Promise.all(filmPromises)
            filmNames.push(...films.map(f => f.title))
          } catch {}

          const imageUrl = `https://picsum.photos/400/300?random=${character.url.split('/').slice(-2, -1)[0]}`

          return {
            ...character,
            speciesName,
            homeworldName,
            filmNames,
            imageUrl,
          }
        })
      )

      setCharacters(charactersWithSpecies)

      const homeworldsMap = new Map<string, string>()
      const filmsMap = new Map<string, string>()
      
      charactersWithSpecies.forEach(char => {
        if (char.homeworldName) {
          homeworldsMap.set(char.homeworld, char.homeworldName)
        }
        char.filmNames.forEach((name, idx) => {
          if (char.films[idx]) {
            filmsMap.set(char.films[idx], name)
          }
        })
      })

      setAvailableHomeworlds(Array.from(homeworldsMap.entries()).map(([url, name]) => ({ url, name })))
      setAvailableFilms(Array.from(filmsMap.entries()).map(([url, name]) => ({ url, name })))
      setAvailableSpecies([...new Set(charactersWithSpecies.map(c => c.speciesName).filter(Boolean))] as string[])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch characters'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewType === 'all') {
      fetchCharacters(currentUrl)
    }
  }, [currentUrl, viewType])

  const handleNext = () => {
    if (nextUrl) {
      setCurrentUrl(nextUrl)
    }
  }

  const handlePrevious = () => {
    if (previousUrl) {
      setCurrentUrl(previousUrl)
    }
  }

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character)
    addToRecentlyViewed(character)
  }

  const handleCloseModal = () => {
    setSelectedCharacter(null)
  }

  const handleCompare = (character: Character) => {
    if (!compareCharacter1) {
      setCompareCharacter1(character)
    } else if (!compareCharacter2 && compareCharacter1.url !== character.url) {
      setCompareCharacter2(character)
    }
  }

  const clearComparison = () => {
    setCompareCharacter1(null)
    setCompareCharacter2(null)
  }

  // Get characters based on view type
  const charactersToDisplay = useMemo(() => {
    if (viewType === 'favorites') {
      return characters.filter(c => isFavorite(c.url))
    }
    if (viewType === 'recent') {
      return characters.filter(c => recentlyViewed.some(r => r.url === c.url))
    }
    return characters
  }, [characters, viewType, favorites, recentlyViewed, isFavorite])

  // Filter and search logic
  const filteredCharacters = useMemo(() => {
    let filtered = charactersToDisplay.filter((character) => {
      const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesHomeworld = !filterHomeworld || character.homeworld === filterHomeworld
      const matchesFilm = !filterFilm || character.films.includes(filterFilm)
      const matchesSpecies = !filterSpecies || character.speciesName === filterSpecies

      return matchesSearch && matchesHomeworld && matchesFilm && matchesSpecies
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'height':
          return (parseInt(a.height) || 0) - (parseInt(b.height) || 0)
        case 'mass':
          return (parseInt(a.mass) || 0) - (parseInt(b.mass) || 0)
        case 'films':
          return b.films.length - a.films.length
        default:
          return 0
      }
    })

    return filtered
  }, [charactersToDisplay, searchQuery, filterHomeworld, filterFilm, filterSpecies, sortBy])

  if (loading && characters.length === 0 && viewType === 'all') {
    return <Loader />
  }

  if (error && characters.length === 0 && viewType === 'all') {
    return <ErrorState message={error.message} onRetry={() => fetchCharacters(currentUrl)} />
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white text-center sm:text-left">
            Star Wars Characters
          </h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* View Type Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setViewType('all')}
            className={`px-4 py-2 font-semibold transition-colors ${
              viewType === 'all'
                ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            All Characters
          </button>
          <button
            onClick={() => setViewType('favorites')}
            className={`px-4 py-2 font-semibold transition-colors ${
              viewType === 'favorites'
                ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setViewType('recent')}
            className={`px-4 py-2 font-semibold transition-colors ${
              viewType === 'recent'
                ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Recently Viewed ({recentlyViewed.length})
          </button>
        </div>

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && viewType === 'all' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.slice(0, 5).map((char) => {
                const fullChar = characters.find(c => c.url === char.url)
                if (!fullChar) return null
                return (
                  <div key={char.url} className="flex-shrink-0 w-48">
                    <CharacterCard
                      name={fullChar.name}
                      speciesName={fullChar.speciesName}
                      imageUrl={fullChar.imageUrl}
                      characterUrl={fullChar.url}
                      onClick={() => handleCharacterClick(fullChar)}
                      viewMode="grid"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Search, Filters, Sort, and View Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="height">Sort by Height</option>
              <option value="mass">Sort by Mass</option>
              <option value="films">Sort by Films</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                List
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filterHomeworld}
              onChange={(e) => setFilterHomeworld(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Homeworlds</option>
              {availableHomeworlds.map((hw) => (
                <option key={hw.url} value={hw.url}>
                  {hw.name}
                </option>
              ))}
            </select>
            <select
              value={filterFilm}
              onChange={(e) => setFilterFilm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Films</option>
              {availableFilms.map((film) => (
                <option key={film.url} value={film.url}>
                  {film.name}
                </option>
              ))}
            </select>
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Species</option>
              {availableSpecies.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Controls */}
        {(compareCharacter1 || compareCharacter2) && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Comparing:</span>
              {compareCharacter1 && (
                <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                  {compareCharacter1.name}
                </span>
              )}
              {compareCharacter2 && (
                <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                  {compareCharacter2.name}
                </span>
              )}
            </div>
            <button
              onClick={clearComparison}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        )}

        {loading && characters.length > 0 && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {filteredCharacters.length === 0 && !loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            No characters found matching your criteria.
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.url}
                  name={character.name}
                  speciesName={character.speciesName}
                  imageUrl={character.imageUrl}
                  characterUrl={character.url}
                  onClick={() => handleCharacterClick(character)}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {viewType === 'all' && (
              <Pagination
                onNext={handleNext}
                onPrevious={handlePrevious}
                hasNext={!!nextUrl}
                hasPrevious={!!previousUrl}
                loading={loading}
              />
            )}
          </>
        )}

        {selectedCharacter && (
          <CharacterModal 
            character={selectedCharacter} 
            onClose={handleCloseModal}
            onCompare={handleCompare}
          />
        )}

        {compareCharacter1 && compareCharacter2 && (
          <CharacterComparison
            character1={compareCharacter1}
            character2={compareCharacter2}
            onClose={clearComparison}
          />
        )}
      </div>
    </div>
  )
}

export default Home
