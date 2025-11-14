// Generate a consistent color based on species name
export const getSpeciesColor = (speciesName: string | null): string => {
  if (!speciesName) return 'bg-gray-500'
  
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ]
  
  // Simple hash function to get consistent color for same species
  let hash = 0
  for (let i = 0; i < speciesName.length; i++) {
    hash = speciesName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

