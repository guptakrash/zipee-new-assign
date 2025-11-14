import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Home from '../pages/Home'
import api from '../services/api'
import { SWAPIResponse, Character } from '../services/api'
import { AuthProvider } from '../context/AuthContext'

// Mock the API - all API calls are mocked
vi.mock('../services/api', () => ({
  default: {
    fetchCharacters: vi.fn(),
    fetchSpecies: vi.fn(),
    fetchPlanet: vi.fn(),
    fetchFilm: vi.fn(),
  },
}))

const mockCharacters: Character[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    birth_year: '19BBY',
    created: '2014-12-09T13:50:51.644000Z',
    films: ['https://swapi.dev/api/films/1/'],
    species: [],
    homeworld: 'https://swapi.dev/api/planets/1/',
    url: 'https://swapi.dev/api/people/1/',
  },
]

const HomeWithAuth = () => {
  localStorage.setItem('sw_token', 'mock_token')
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

describe('Home Component - API Mocking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock all API calls
    vi.mocked(api.fetchCharacters).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: mockCharacters,
    } as SWAPIResponse<Character>)
    
    vi.mocked(api.fetchPlanet).mockResolvedValue({
      name: 'Tatooine',
      terrain: 'desert',
      climate: 'arid',
      population: '200000',
    })
  })

  it('mocks API call to fetchCharacters', async () => {
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(api.fetchCharacters).toHaveBeenCalled()
      expect(api.fetchCharacters).toHaveBeenCalledWith('https://swapi.dev/api/people/')
    })
  })

  it('mocks API call to fetchPlanet when character card is clicked', async () => {
    const user = userEvent.setup()
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    })
    
    // Click on character card to open modal
    const card = screen.getByText('Luke Skywalker').closest('div')
    if (card) {
      await user.click(card)
      
      // Verify fetchPlanet was called for homeworld details
      await waitFor(() => {
        expect(api.fetchPlanet).toHaveBeenCalled()
        expect(api.fetchPlanet).toHaveBeenCalledWith('https://swapi.dev/api/planets/1/')
      })
    }
  })

  it('handles API errors gracefully', async () => {
    vi.mocked(api.fetchCharacters).mockRejectedValue(new Error('API Error'))
    
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch characters|Something went wrong/)).toBeInTheDocument()
    })
  })

  it('mocks pagination API calls', async () => {
    const user = userEvent.setup()
    
    // Mock response with next page
    vi.mocked(api.fetchCharacters).mockResolvedValueOnce({
      count: 2,
      next: 'https://swapi.dev/api/people/?page=2',
      previous: null,
      results: mockCharacters,
    } as SWAPIResponse<Character>)
    
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    })
    
    // Mock next page response
    vi.mocked(api.fetchCharacters).mockResolvedValueOnce({
      count: 2,
      next: null,
      previous: 'https://swapi.dev/api/people/',
      results: mockCharacters,
    } as SWAPIResponse<Character>)
    
    const nextButton = screen.getByText('Next')
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(api.fetchCharacters).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=2')
    })
  })
})

