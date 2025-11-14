import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CharacterCard from '../components/CharacterCard/CharacterCard'
import { FavoritesProvider } from '../context/FavoritesContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<FavoritesProvider>{ui}</FavoritesProvider>)
}

describe('CharacterCard', () => {
  let mockOnClick: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnClick = vi.fn()
    vi.clearAllMocks()
  })

  it('renders character card with name', () => {
    renderWithProviders(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        characterUrl="https://swapi.dev/api/people/1/"
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
  })

  it('renders character card with image', () => {
    renderWithProviders(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        characterUrl="https://swapi.dev/api/people/1/"
        onClick={mockOnClick}
      />
    )
    
    const image = screen.getByAltText('Luke Skywalker')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://picsum.photos/400/300')
  })

  it('renders species name when provided', () => {
    renderWithProviders(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        characterUrl="https://swapi.dev/api/people/1/"
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Human')).toBeInTheDocument()
  })

  it('does not render species name when not provided', () => {
    renderWithProviders(
      <CharacterCard
        name="Luke Skywalker"
        speciesName={null}
        imageUrl="https://picsum.photos/400/300"
        characterUrl="https://swapi.dev/api/people/1/"
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.queryByText('Human')).not.toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        characterUrl="https://swapi.dev/api/people/1/"
        onClick={mockOnClick}
      />
    )
    
    const card = screen.getByText('Luke Skywalker').closest('div')
    if (card) {
      await user.click(card)
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    }
  })

  it('renders multiple character cards correctly', () => {
    renderWithProviders(
      <>
        <CharacterCard
          name="Luke Skywalker"
          speciesName="Human"
          imageUrl="https://picsum.photos/400/300"
          characterUrl="https://swapi.dev/api/people/1/"
          onClick={mockOnClick}
        />
        <CharacterCard
          name="Darth Vader"
          speciesName="Human"
          imageUrl="https://picsum.photos/400/301"
          characterUrl="https://swapi.dev/api/people/4/"
          onClick={mockOnClick}
        />
      </>
    )
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()
  })
})

