import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Character } from '../services/api'

interface FavoritesContextType {
  favorites: string[]
  addFavorite: (characterUrl: string) => void
  removeFavorite: (characterUrl: string) => void
  isFavorite: (characterUrl: string) => boolean
  toggleFavorite: (characterUrl: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('sw_favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites)
    localStorage.setItem('sw_favorites', JSON.stringify(newFavorites))
  }

  const addFavorite = (characterUrl: string) => {
    if (!favorites.includes(characterUrl)) {
      saveFavorites([...favorites, characterUrl])
    }
  }

  const removeFavorite = (characterUrl: string) => {
    saveFavorites(favorites.filter(url => url !== characterUrl))
  }

  const isFavorite = (characterUrl: string) => {
    return favorites.includes(characterUrl)
  }

  const toggleFavorite = (characterUrl: string) => {
    if (isFavorite(characterUrl)) {
      removeFavorite(characterUrl)
    } else {
      addFavorite(characterUrl)
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

