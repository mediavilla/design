const DEFAULT_GRID_SIZE = 32;
const GEIST_SANS_CSS_FONT_FAMILY = 'var(--font-geist-sans)';
const GEIST_MONO_CSS_FONT_FAMILY = 'var(--font-geist-mono)';
const GEIST_PIXEL_SQUARE_CSS_FONT_FAMILY = 'var(--font-geist-pixel-square)';
const GEIST_PIXEL_GRID_CSS_FONT_FAMILY = 'var(--font-geist-pixel-grid)';
const GEIST_PIXEL_CIRCLE_CSS_FONT_FAMILY = 'var(--font-geist-pixel-circle)';
const GEIST_PIXEL_LINE_CSS_FONT_FAMILY = 'var(--font-geist-pixel-line)';
const GEIST_SANS_MEASURE_FONT_FAMILY = 'Geist Sans';
const GEIST_MONO_MEASURE_FONT_FAMILY = 'Geist Mono';
const GEIST_PIXEL_SQUARE_MEASURE_FONT_FAMILY = 'Geist Pixel Square';
const GEIST_PIXEL_GRID_MEASURE_FONT_FAMILY = 'Geist Pixel Grid';
const GEIST_PIXEL_CIRCLE_MEASURE_FONT_FAMILY = 'Geist Pixel Circle';
const GEIST_PIXEL_LINE_MEASURE_FONT_FAMILY = 'Geist Pixel Line';
const DOTMATRIX_FONT_FAMILY = 'DotMatrix';

const legacyVariantMap = {
  topbarTitle: 'topbarTitle-1',
  nav: 'nav-1',
  display: 'display-2',
  section: 'section-1',
  body: 'body-1',
  micro: 'micro-1',
};

/**
 * Returns the exact typography config for a variant at the current grid size.
 */
export function getTypographyVariant(variant, gridSize = DEFAULT_GRID_SIZE) {
  const normalizedVariant = legacyVariantMap[variant] ?? variant;
  const pretextTypography = createTypographyMap(gridSize);

  return pretextTypography[normalizedVariant] ?? pretextTypography['body-1'];
}

/**
 * Centralizes font shorthands and snapped line heights for CSS and Pretext.
 */
function createTypographyMap(gridSize) {
  return {
    'topbarTitle-1': createVariant({
      weight: 700,
      fontSize: gridSize,
      lineHeight: gridSize * 1.5,
      cssFontFamily: GEIST_SANS_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_SANS_MEASURE_FONT_FAMILY,
      fallback: 'sans-serif',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.1875),
    }),
    'nav-1': createVariant({
      weight: 600,
      fontSize: gridSize * 0.5,
      lineHeight: gridSize,
      cssFontFamily: GEIST_SANS_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_SANS_MEASURE_FONT_FAMILY,
      fallback: 'sans-serif',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.1875),
    }),
    'display-2': createVariant({
      weight: 700,
      fontSize: gridSize * 2,
      lineHeight: gridSize * 2,
      cssFontFamily: GEIST_SANS_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_SANS_MEASURE_FONT_FAMILY,
      fallback: 'sans-serif',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.21875),
    }),
    'section-1': createVariant({
      weight: 700,
      fontSize: gridSize,
      lineHeight: gridSize,
      cssFontFamily: GEIST_SANS_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_SANS_MEASURE_FONT_FAMILY,
      fallback: 'sans-serif',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.1875),
    }),
    'body-1': createVariant({
      weight: 600,
      fontSize: gridSize * 0.75,
      lineHeight: gridSize,
      cssFontFamily: GEIST_SANS_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_SANS_MEASURE_FONT_FAMILY,
      fallback: 'sans-serif',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.1875),
    }),
    'body-2': createVariant({
      weight: 600,
      fontSize: gridSize * 0.75,
      lineHeight: gridSize * 2,
      cssFontFamily: GEIST_SANS_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_SANS_MEASURE_FONT_FAMILY,
      fallback: 'sans-serif',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.1875),
    }),
    'micro-1': createVariant({
      weight: 600,
      fontSize: gridSize * 0.4375,
      lineHeight: gridSize,
      cssFontFamily: GEIST_MONO_CSS_FONT_FAMILY,
      measureFontFamily: GEIST_MONO_MEASURE_FONT_FAMILY,
      fallback: 'monospace',
      alignmentSample: 'HÉgjpqQÅ',
      baselineShiftY: Math.round(gridSize * 0.1875),
    }),
    ...createGeistVariantSet('geistSans', gridSize, GEIST_SANS_CSS_FONT_FAMILY, GEIST_SANS_MEASURE_FONT_FAMILY, 'sans-serif', 700),
    ...createGeistVariantSet('geistMono', gridSize, GEIST_MONO_CSS_FONT_FAMILY, GEIST_MONO_MEASURE_FONT_FAMILY, 'monospace', 600),
    'dotmatrix-7': createVariant({
      weight: 400,
      fontSize: (gridSize * 7) / 0.84,
      lineHeight: gridSize * 7,
      cssFontFamily: DOTMATRIX_FONT_FAMILY,
      measureFontFamily: DOTMATRIX_FONT_FAMILY,
      fallback: `${GEIST_SANS_CSS_FONT_FAMILY}, sans-serif`,
      alignmentSample: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      inkOffsetX: -gridSize / 3,
      inkOffsetY: Math.round(gridSize * 0.15),
      characterTrackingX: gridSize * 0.375,
    }),
    ...createGeistVariantSet('geistPixelSquare', gridSize, GEIST_PIXEL_SQUARE_CSS_FONT_FAMILY, GEIST_PIXEL_SQUARE_MEASURE_FONT_FAMILY, 'monospace', 500, {
      inkFit: true,
      /* nudge the ink down so glyph bottoms rest just above the grid line below */
      inkOffsetY: gridSize * 0.16,
    }),
    ...createGeistVariantSet('geistPixelGrid', gridSize, GEIST_PIXEL_GRID_CSS_FONT_FAMILY, GEIST_PIXEL_GRID_MEASURE_FONT_FAMILY, 'monospace', 500, {
      inkFit: true,
    }),
    ...createGeistVariantSet('geistPixelCircle', gridSize, GEIST_PIXEL_CIRCLE_CSS_FONT_FAMILY, GEIST_PIXEL_CIRCLE_MEASURE_FONT_FAMILY, 'monospace', 500, {
      inkFit: true,
    }),
    ...createGeistVariantSet('geistPixelLine', gridSize, GEIST_PIXEL_LINE_CSS_FONT_FAMILY, GEIST_PIXEL_LINE_MEASURE_FONT_FAMILY, 'monospace', 500, {
      inkFit: true,
      inkOffsetY: -gridSize * 0.25,
    }),
  };
}

/**
 * Builds 1-7 row variants for each Geist family.
 */
function createGeistVariantSet(prefix, gridSize, cssFontFamily, measureFontFamily, fallback, weight, calibration = {}) {
  return Array.from({ length: 7 }, (_, index) => {
    const rows = index + 1;
    const targetHeight = gridSize * rows;
    const fontSize = targetHeight / (calibration.glyphHeightRatio ?? 0.888);

    return [
      `${prefix}-${rows}`,
      createVariant({
        weight,
        fontSize,
        lineHeight: targetHeight,
        cssFontFamily,
        measureFontFamily,
        fallback,
        alignmentSample: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789HÉgjpqQÅ',
        inkFit: calibration.inkFit ?? true,
        inkFitRows: rows,
        inkOffsetX: calibration.inkOffsetX,
        inkOffsetY: calibration.inkOffsetY ?? 0,
        characterTrackingX: calibration.characterTrackingX,
      }),
    ];
  }).reduce((variants, [key, value]) => {
    variants[key] = value;
    return variants;
  }, {});
}

/**
 * Creates paired CSS and canvas font shorthands from the same numbers.
 */
function createVariant({
  weight,
  fontSize,
  lineHeight,
  cssFontFamily,
  measureFontFamily,
  fallback,
  alignmentSample,
  baselineShiftY = 0,
  inkFit = false,
  inkFitRows,
  inkOffsetX,
  inkOffsetY,
  characterTrackingX,
}) {
  return {
    cssFont: `${weight} ${fontSize}px/${lineHeight}px ${cssFontFamily}, ${fallback}`,
    measureFont: `${weight} ${fontSize}px ${measureFontFamily}`,
    weight,
    fontSize,
    lineHeight,
    cssFontFamily,
    measureFontFamily,
    fallback,
    whiteSpace: 'normal',
    alignmentSample,
    baselineShiftY,
    inkFit,
    inkFitRows,
    inkOffsetX,
    inkOffsetY,
    characterTrackingX,
  };
}
