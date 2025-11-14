const BASE_URL = 'https://swapi.dev/api'

export interface SWAPIResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Character {
  name: string
  height: string
  mass: string
  birth_year: string
  created: string
  films: string[]
  species: string[]
  homeworld: string
  url: string
}

export interface Species {
  name: string
}

export interface Planet {
  name: string
  terrain: string
  climate: string
  population: string
}

export interface Film {
  title: string
}

class SWAPIService {
  async fetchCharacters(url: string = `${BASE_URL}/people/`): Promise<SWAPIResponse<Character>> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }
    return response.json()
  }

  async fetchSpecies(url: string): Promise<Species> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch species')
    }
    return response.json()
  }

  async fetchPlanet(url: string): Promise<Planet> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch planet')
    }
    return response.json()
  }

  async fetchFilm(url: string): Promise<Film> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch film')
    }
    return response.json()
  }
}

export default new SWAPIService()

