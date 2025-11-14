export const convertHeight = (height: string): string => {
  const heightInCm = parseInt(height)
  if (isNaN(heightInCm)) return 'Unknown'
  const heightInM = heightInCm / 100
  return `${heightInM.toFixed(2)} m`
}

