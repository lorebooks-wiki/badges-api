
/**
 * Validate badge style name received from the HTTP request before
 * rendering into makeBadge function.
 * @param style String of a style name to validate against
 * @returns Either the lowercased style name or the defaults
 */
export function validateBadgeStyle(style?: string) {
  const validStyles = ['plastic', 'flat', 'flat-square', 'for-the-badge', 'social']

  if (style !== undefined && validStyles.includes(style?.toLowerCase())) {
    return style?.toLowerCase()
  } else {
    return "flat"
  }
}