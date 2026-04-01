const GRID_SIZE = 32;
const DISPLAY_FONT_FAMILY = 'neue-haas-grotesk-display';

/**
 * Centralizes the exact font shorthands and snapped line heights used by both CSS and Pretext.
 */
export const pretextTypography = {
  'topbarTitle-1': {
    cssFont: `700 ${GRID_SIZE * 0.75}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `700 ${GRID_SIZE * 0.75}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 6,
  },
  'nav-1': {
    cssFont: `600 ${GRID_SIZE * 0.5}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.5}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 6,
  },
  'display-2': {
    cssFont: `700 ${GRID_SIZE * 2}px/${GRID_SIZE * 2}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `700 ${GRID_SIZE * 2}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE * 2,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 7,
  },
  'section-1': {
    cssFont: `700 ${GRID_SIZE}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `700 ${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 6,
  },
  'body-1': {
    cssFont: `600 ${GRID_SIZE * 0.75}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.75}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 6,
  },
  'body-2': {
    cssFont: `600 ${GRID_SIZE * 0.75}px/${GRID_SIZE * 2}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.75}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE * 2,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 6,
  },
  'micro-1': {
    cssFont: `600 ${GRID_SIZE * 0.4375}px/${GRID_SIZE}px ${DISPLAY_FONT_FAMILY}, sans-serif`,
    measureFont: `600 ${GRID_SIZE * 0.4375}px ${DISPLAY_FONT_FAMILY}`,
    lineHeight: GRID_SIZE,
    whiteSpace: 'normal',
    alignmentSample: 'HÉgjpqQÅ',
    baselineShiftY: 6,
  },
};

const legacyVariantMap = {
  topbarTitle: 'topbarTitle-1',
  nav: 'nav-1',
  display: 'display-2',
  section: 'section-1',
  body: 'body-1',
  micro: 'micro-1',
};

/**
 * Returns the configuration for a known typography variant.
 */
export function getTypographyVariant(variant) {
  const normalizedVariant = legacyVariantMap[variant] ?? variant;

  return pretextTypography[normalizedVariant] ?? pretextTypography['body-1'];
}
