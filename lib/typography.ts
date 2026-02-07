/**
 * Typography utilities for consistent text sizing across templates
 */

/**
 * Calculate responsive title font size based on character count
 * Longer titles get smaller fonts to fit within the OG image bounds
 *
 * @param title - The title text
 * @param base - Base font size for short titles (default: 60)
 * @returns Calculated font size in pixels
 */
export function getTitleFontSize(title: string, base = 60): number {
  const length = title.length;
  if (length > 50) return base - 16;
  if (length > 35) return base - 8;
  return base;
}

/**
 * Calculate responsive description font size
 *
 * @param description - The description text
 * @param base - Base font size (default: 24)
 * @returns Calculated font size in pixels
 */
export function getDescriptionFontSize(description: string, base = 24): number {
  const length = description.length;
  if (length > 150) return base - 4;
  if (length > 100) return base - 2;
  return base;
}

/**
 * Clamp overlay opacity to valid range
 *
 * @param opacity - Raw opacity value
 * @param min - Minimum opacity (default: 0)
 * @param max - Maximum opacity (default: 0.95)
 * @returns Clamped opacity value
 */
export function clampOverlayOpacity(
  opacity: number,
  min = 0,
  max = 0.95
): number {
  return Math.min(max, Math.max(min, opacity));
}

/**
 * Truncate text with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Count Unicode characters (handles emojis correctly)
 *
 * @param value - String to count
 * @returns Number of Unicode characters
 */
export function countUnicodeChars(value: string): number {
  return Array.from(value).length;
}
