const GRID_SIZE = 32;
const DISPLAY_FONT_FAMILY = 'neue-haas-grotesk-display';

/**
 * Centralizes the exact font shorthands and line heights used by both CSS and Pretext.
 */
export const pretextTypography = {
  topbarTitle: {
    cssFont: `700 ${GRID_SIZE * 0.75}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `700 ${GRID_SIZE * 0.75}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
  },
  nav: {
    cssFont: `600 ${GRID_SIZE * 0.5}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.5}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
  },
  display: {
    cssFont: `700 ${GRID_SIZE * 2}px/${GRID_SIZE * 2}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `700 ${GRID_SIZE * 2}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE * 2,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
  },
  section: {
    cssFont: `700 ${GRID_SIZE}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `700 ${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
  },
  body: {
    cssFont: `600 ${GRID_SIZE * 0.75}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.75}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
  },
  micro: {
    cssFont: `600 ${GRID_SIZE * 0.4375}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.4375}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
  },
};

/**
 * Returns the configuration for a known typography variant.
 */
export function getTypographyVariant(variant) {
  return pretextTypography[variant] ?? pretextTypography.body;
}
