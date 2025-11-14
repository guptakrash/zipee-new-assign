import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CharacterCard from '../components/CharacterCard/CharacterCard'

describe('CharacterCard', () => {
  let mockOnClick: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnClick = vi.fn()
    vi.clearAllMocks()
  })

  it('renders character card with name', () => {
    render(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
  })

  it('renders character card with image', () => {
    render(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        onClick={mockOnClick}
      />
    )
    
    const image = screen.getByAltText('Luke Skywalker')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://picsum.photos/400/300')
  })

  it('renders species name when provided', () => {
    render(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Human')).toBeInTheDocument()
  })

  it('does not render species name when not provided', () => {
    render(
      <CharacterCard
        name="Luke Skywalker"
        speciesName={null}
        imageUrl="https://picsum.photos/400/300"
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.queryByText('Human')).not.toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    render(
      <CharacterCard
        name="Luke Skywalker"
        speciesName="Human"
        imageUrl="https://picsum.photos/400/300"
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
    render(
      <>
        <CharacterCard
          name="Luke Skywalker"
          speciesName="Human"
          imageUrl="https://picsum.photos/400/300"
          onClick={mockOnClick}
        />
        <CharacterCard
          name="Darth Vader"
          speciesName="Human"
          imageUrl="https://picsum.photos/400/301"
          onClick={mockOnClick}
        />
      </>
    )
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()
  })
})

