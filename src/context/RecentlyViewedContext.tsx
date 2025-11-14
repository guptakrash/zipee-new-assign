import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Character } from '../services/api'

interface RecentlyViewedContextType {
  recentlyViewed: Character[]
  addToRecentlyViewed: (character: Character) => void
  clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const MAX_RECENT_ITEMS = 5

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Character[]>([])

  useEffect(() => {
    // Load recently viewed from localStorage
    const saved = localStorage.getItem('sw_recently_viewed')
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved))
      } catch {
        setRecentlyViewed([])
      }
    }
  }, [])

  const addToRecentlyViewed = (character: Character) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(c => c.url !== character.url)
      // Add to beginning and limit to MAX_RECENT_ITEMS
      const updated = [character, ...filtered].slice(0, MAX_RECENT_ITEMS)
      localStorage.setItem('sw_recently_viewed', JSON.stringify(updated))
      return updated
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem('sw_recently_viewed')
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}

