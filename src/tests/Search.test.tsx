import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Home from '../pages/Home'
import api from '../services/api'
import { SWAPIResponse, Character } from '../services/api'
import { AuthProvider } from '../context/AuthContext'

// Mock the API
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
    films: [],
    species: [],
    homeworld: 'https://swapi.dev/api/planets/1/',
    url: 'https://swapi.dev/api/people/1/',
  },
  {
    name: 'Darth Vader',
    height: '202',
    mass: '136',
    birth_year: '41.9BBY',
    created: '2014-12-10T15:18:20.704000Z',
    films: [],
    species: [],
    homeworld: 'https://swapi.dev/api/planets/1/',
    url: 'https://swapi.dev/api/people/4/',
  },
  {
    name: 'Leia Organa',
    height: '150',
    mass: '49',
    birth_year: '19BBY',
    created: '2014-12-10T15:20:09.791000Z',
    films: [],
    species: [],
    homeworld: 'https://swapi.dev/api/planets/2/',
    url: 'https://swapi.dev/api/people/5/',
  },
]

const HomeWithAuth = () => {
  // Mock authentication by setting token in localStorage
  localStorage.setItem('sw_token', 'mock_token')
  
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

describe('Search Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock API responses
    vi.mocked(api.fetchCharacters).mockResolvedValue({
      count: 3,
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

  it('renders all characters initially', async () => {
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
      expect(screen.getByText('Darth Vader')).toBeInTheDocument()
      expect(screen.getByText('Leia Organa')).toBeInTheDocument()
    })
  })

  it('filters characters by search query - partial match', async () => {
    const user = userEvent.setup()
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search by name...')
    await user.type(searchInput, 'Luke')
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
      expect(screen.queryByText('Darth Vader')).not.toBeInTheDocument()
      expect(screen.queryByText('Leia Organa')).not.toBeInTheDocument()
    })
  })

  it('filters characters by search query - case insensitive', async () => {
    const user = userEvent.setup()
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search by name...')
    await user.type(searchInput, 'DARTH')
    
    await waitFor(() => {
      expect(screen.getByText('Darth Vader')).toBeInTheDocument()
      expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()
      expect(screen.queryByText('Leia Organa')).not.toBeInTheDocument()
    })
  })

  it('shows no results message when search matches nothing', async () => {
    const user = userEvent.setup()
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search by name...')
    await user.type(searchInput, 'NonExistentCharacter')
    
    await waitFor(() => {
      expect(screen.getByText('No characters found matching your criteria.')).toBeInTheDocument()
    })
  })

  it('clears search and shows all characters', async () => {
    const user = userEvent.setup()
    render(<HomeWithAuth />)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search by name...')
    await user.type(searchInput, 'Luke')
    
    await waitFor(() => {
      expect(screen.queryByText('Darth Vader')).not.toBeInTheDocument()
    })
    
    await user.clear(searchInput)
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
      expect(screen.getByText('Darth Vader')).toBeInTheDocument()
      expect(screen.getByText('Leia Organa')).toBeInTheDocument()
    })
  })
})
