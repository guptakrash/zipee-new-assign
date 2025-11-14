import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CharacterModal from '../components/CharacterModal/CharacterModal'
import api from '../services/api'
import { Character } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  default: {
    fetchPlanet: vi.fn(),
  },
}))

const mockCharacter: Character = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  birth_year: '19BBY',
  created: '2014-12-09T13:50:51.644000Z',
  films: ['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'],
  species: [],
  homeworld: 'https://swapi.dev/api/planets/1/',
  url: 'https://swapi.dev/api/people/1/',
}

describe('CharacterModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens modal and displays correct character name', () => {
    vi.mocked(api.fetchPlanet).mockResolvedValue({
      name: 'Tatooine',
      terrain: 'desert',
      climate: 'arid',
      population: '200000',
    })

    render(<CharacterModal character={mockCharacter} onClose={() => {}} />)
    
    // Verify modal opens with correct character name
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    // Verify modal header contains the name
    const header = screen.getByText('Luke Skywalker')
    expect(header).toBeInTheDocument()
  })

  it('opens modal with different character name correctly', () => {
    const differentCharacter: Character = {
      ...mockCharacter,
      name: 'Darth Vader',
    }

    vi.mocked(api.fetchPlanet).mockResolvedValue({
      name: 'Tatooine',
      terrain: 'desert',
      climate: 'arid',
      population: '200000',
    })

    render(<CharacterModal character={differentCharacter} onClose={() => {}} />)
    
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()
  })

  it('displays character details correctly', async () => {
    vi.mocked(api.fetchPlanet).mockResolvedValue({
      name: 'Tatooine',
      terrain: 'desert',
      climate: 'arid',
      population: '200000',
    })

    render(<CharacterModal character={mockCharacter} onClose={() => {}} />)
    
    await waitFor(() => {
      expect(screen.getByText('1.72 m')).toBeInTheDocument()
      expect(screen.getByText('77 kg')).toBeInTheDocument()
      expect(screen.getByText('19BBY')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Film count
    })
  })

  it('displays homeworld details when loaded', async () => {
    vi.mocked(api.fetchPlanet).mockResolvedValue({
      name: 'Tatooine',
      terrain: 'desert',
      climate: 'arid',
      population: '200000',
    })

    render(<CharacterModal character={mockCharacter} onClose={() => {}} />)
    
    await waitFor(() => {
      expect(screen.getByText('Tatooine')).toBeInTheDocument()
      expect(screen.getByText('desert')).toBeInTheDocument()
      expect(screen.getByText('arid')).toBeInTheDocument()
      expect(screen.getByText('200000')).toBeInTheDocument()
    })
  })
})

