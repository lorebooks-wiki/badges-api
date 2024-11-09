const VALID_BADGE_STYLES = ['plastic', 'flat', 'flat-square', 'for-the-badge', 'social'] as const;
type BadgeStyle = typeof VALID_BADGE_STYLES[number];

/**
 * Validate badge style name received from the HTTP request before
 * rendering into makeBadge function.
 * @param {string} style String of a style name to validate against supported badge styles by badge-maker
 * @returns Either the lowercased style name or the defaults
 */
export function validateBadgeStyle(style?: string): BadgeStyle {
  if (!style) return 'flat';

  const normalizedStyle = style.toLowerCase();
  return VALID_BADGE_STYLES.includes(normalizedStyle as BadgeStyle)
    ? (normalizedStyle as BadgeStyle)
    : 'flat';
}