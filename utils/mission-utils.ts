/**
 * Calculates the percentage completion of a mission
 * @param current Current progress value
 * @param total Total required to complete
 * @returns Percentage as a number between 0-100
 */
export function calculateProgressPercentage(current: number, total: number): number {
  if (total <= 0) return 0
  const percentage = (current / total) * 100
  return Math.min(Math.max(percentage, 0), 100) // Clamp between 0-100
}

/**
 * Parses a progress string in the format "x/y" and returns current and total values
 * @param progressString Progress string in format "x/y"
 * @returns Object with current and total values
 */
export function parseProgressString(progressString: string): { current: number; total: number } {
  const [current, total] = progressString.split("/").map(Number)
  return { current: isNaN(current) ? 0 : current, total: isNaN(total) ? 0 : total }
}

/**
 * Determines if a mission is complete based on progress
 * @param current Current progress value
 * @param total Total required to complete
 * @returns Boolean indicating if mission is complete
 */
export function isMissionComplete(current: number, total: number): boolean {
  return current >= total
}

/**
 * Formats mission progress as a string
 * @param current Current progress value
 * @param total Total required to complete
 * @returns Formatted string in "x/y" format
 */
export function formatProgressString(current: number, total: number): string {
  return `${current}/${total}`
}
