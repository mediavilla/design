import { useEffect, useMemo, useRef, useState } from 'react';
import { layout, prepare } from '@chenglou/pretext';
import { getGridSize } from '@/lib/gridMeasurements';
import { getTypographyVariant } from '@/lib/pretextTypography';

const preparedTextCache = new Map();
const alignmentOffsetCache = new Map();
const loggedMismatches = new Set();

const DOTMATRIX_GLYPH_RATIO = 0.84;
const DOTMATRIX_MAX_ROWS = 7;
const DOTMATRIX_MIN_ROWS = 1;

/**
 * Measures text with Pretext after mount, caches the expensive prepare step, and reruns only layout on resize.
 */
export function usePretextMeasurement({ text, variant, whiteSpace, singleLineFit }) {
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [gridSize, setGridSize] = useState(0);
  const [measurement, setMeasurement] = useState({
    cssFont: undefined,
    height: 0,
    lineCount: 0,
    offsetY: 0,
    ready: false,
    characterTrackingX: undefined,
  });
  const config = useMemo(() => getTypographyVariant(variant, gridSize || 32), [gridSize, variant]);
  const { alignmentSample, baselineShiftY, inkOffsetY, lineHeight, measureFont } = config;
  const effectiveWhiteSpace = whiteSpace ?? config.whiteSpace;

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    const readGridSize = () => {
      setGridSize(getGridSize(document));
    };

    const readElementWidth = () => {
      const nextWidth = element.getBoundingClientRect().width;
      if (nextWidth > 0) {
        setWidth(nextWidth);
      }
    };

    readGridSize();
    readElementWidth();

    const elementObserver = new ResizeObserver((entries) => {
      const entry = entries.find((candidate) => candidate.target === element);
      if (entry) {
        const nextWidth = entry.contentRect.width;
        if (nextWidth > 0) {
          setWidth(nextWidth);
        }
      }
    });

    const rootObserver = new ResizeObserver(() => {
      readGridSize();
      readElementWidth();
    });

    elementObserver.observe(element);
    rootObserver.observe(document.documentElement);
    window.addEventListener('resize', readGridSize);

    return () => {
      elementObserver.disconnect();
      rootObserver.disconnect();
      window.removeEventListener('resize', readGridSize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function measureText() {
      if (!text || width <= 0 || gridSize <= 0) {
        setMeasurement({
          cssFont: undefined,
          height: 0,
          lineCount: 0,
          offsetY: 0,
          ready: false,
          characterTrackingX: undefined,
        });
        return;
      }

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      if (cancelled) {
        return;
      }

      let resolvedConfig = resolveInkFitConfig(config, elementRef.current, text);

      if (singleLineFit && resolvedConfig.characterTrackingX) {
        resolvedConfig = fitTrackedSingleLine(resolvedConfig, text, width, gridSize, elementRef.current);
      }

      const cacheKey = `${resolvedConfig.measureFont}__${effectiveWhiteSpace}__${text}`;
      let prepared = preparedTextCache.get(cacheKey);

      if (!prepared) {
        prepared = prepare(text, resolvedConfig.measureFont, { whiteSpace: effectiveWhiteSpace });
        preparedTextCache.set(cacheKey, prepared);
      }

      const result = singleLineFit && resolvedConfig.characterTrackingX
        ? { lineCount: 1, height: resolvedConfig.lineHeight }
        : layout(prepared, width, resolvedConfig.lineHeight);
      const offsetY = getGridTextOffset(resolvedConfig);

      if (cancelled) {
        return;
      }

      setMeasurement({
        cssFont: resolvedConfig.cssFont,
        height: result.height,
        lineCount: result.lineCount,
        offsetY,
        ready: true,
        characterTrackingX: resolvedConfig.characterTrackingX,
      });

      if (process.env.NODE_ENV !== 'production') {
        window.requestAnimationFrame(() => {
          const element = elementRef.current;

          if (!element) {
            return;
          }

          const mismatch = Math.abs(element.scrollHeight - result.height);
          const mismatchKey = `${variant}__${text}`;

          if (mismatch > 1 && !loggedMismatches.has(mismatchKey)) {
            loggedMismatches.add(mismatchKey);
            console.warn('[pretext] height mismatch', {
              variant,
              text,
              measured: result.height,
              rendered: element.scrollHeight,
            });
          }
        });
      }
    }

    measureText();

    return () => {
      cancelled = true;
    };
  }, [
    alignmentSample,
    baselineShiftY,
    config,
    effectiveWhiteSpace,
    gridSize,
    inkOffsetY,
    lineHeight,
    measureFont,
    singleLineFit,
    text,
    variant,
    width,
  ]);

  return {
    config: measurement.ready
      ? { ...config, characterTrackingX: measurement.characterTrackingX ?? config.characterTrackingX }
      : config,
    cssFont: measurement.ready ? measurement.cssFont : undefined,
    elementRef,
    lineCount: measurement.lineCount,
    height: measurement.height,
    offsetY: measurement.offsetY,
    ready: measurement.ready,
    characterTrackingX: measurement.characterTrackingX,
  };
}

/**
 * Scales display fonts so their measured ink height fills the target grid rows.
 */
function resolveInkFitConfig(config, scopeElement, text) {
  if (typeof document === 'undefined') {
    return config;
  }

  const measureFontFamily = resolveCssFontFamily(config.cssFontFamily, scopeElement) || config.measureFontFamily;
  const runtimeConfig = {
    ...config,
    alignmentSample: config.inkFit && text ? text : config.alignmentSample,
    measureFont: `${config.weight} ${config.fontSize}px ${measureFontFamily}`,
    measureFontFamily,
  };

  if (!runtimeConfig.inkFit) {
    return runtimeConfig;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return runtimeConfig;
  }

  context.font = runtimeConfig.measureFont;
  const metrics = context.measureText(runtimeConfig.alignmentSample);
  const actualHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);

  if (actualHeight <= 0) {
    return runtimeConfig;
  }

  const targetHeight = runtimeConfig.lineHeight;
  const scale = targetHeight / actualHeight;
  const fontSize = runtimeConfig.fontSize * scale;
  const cssFont = `${runtimeConfig.weight} ${fontSize}px/${runtimeConfig.lineHeight}px ${runtimeConfig.cssFontFamily}, ${runtimeConfig.fallback}`;
  const measureFont = `${runtimeConfig.weight} ${fontSize}px ${measureFontFamily}`;

  return {
    ...runtimeConfig,
    cssFont,
    fontSize,
    measureFont,
  };
}

/**
 * Shrinks tracked display type by whole grid rows until it fits on one line.
 */
function fitTrackedSingleLine(config, text, containerWidth, gridSize, scopeElement) {
  const measureFontFamily = resolveCssFontFamily(config.cssFontFamily, scopeElement) || config.measureFontFamily;
  const fitWidth = containerWidth - Math.min(config.inkOffsetX ?? 0, 0);

  for (let rows = DOTMATRIX_MAX_ROWS; rows >= DOTMATRIX_MIN_ROWS; rows -= 1) {
    const candidate = createDotmatrixConfig(config, gridSize, rows, measureFontFamily);
    const trackedWidth = measureTrackedTextWidth(text, candidate.measureFont, candidate.characterTrackingX);

    if (trackedWidth <= fitWidth) {
      return candidate;
    }
  }

  const fallback = createDotmatrixConfig(config, gridSize, DOTMATRIX_MIN_ROWS, measureFontFamily);
  const trackedWidth = measureTrackedTextWidth(text, fallback.measureFont, fallback.characterTrackingX);

  if (trackedWidth <= fitWidth || trackedWidth <= 0) {
    return fallback;
  }

  const scale = fitWidth / trackedWidth;

  const scaledFontSize = fallback.fontSize * scale;
  const scaledLineHeight = fallback.lineHeight * scale;

  return {
    ...fallback,
    fontSize: scaledFontSize,
    lineHeight: scaledLineHeight,
    characterTrackingX: fallback.characterTrackingX * scale,
    inkOffsetX: fallback.inkOffsetX * scale,
    inkOffsetY: fallback.inkOffsetY * scale,
    cssFont: `${config.weight} ${scaledFontSize}px/${scaledLineHeight}px ${config.cssFontFamily}, ${config.fallback}`,
    measureFont: `${config.weight} ${scaledFontSize}px ${measureFontFamily}`,
  };
}

function createDotmatrixConfig(config, gridSize, rows, measureFontFamily) {
  const lineHeight = gridSize * rows;
  const fontSize = (gridSize * rows) / DOTMATRIX_GLYPH_RATIO;
  const characterTrackingX = gridSize * 0.375;
  const inkOffsetX = -gridSize / 3;
  const inkOffsetY = Math.round(gridSize * 0.15);
  const measureFont = `${config.weight} ${fontSize}px ${measureFontFamily}`;
  const cssFont = `${config.weight} ${fontSize}px/${lineHeight}px ${config.cssFontFamily}, ${config.fallback}`;

  return {
    ...config,
    fontSize,
    lineHeight,
    cssFont,
    measureFont,
    measureFontFamily,
    characterTrackingX,
    inkOffsetX,
    inkOffsetY,
  };
}

function measureTrackedTextWidth(text, measureFont, characterTrackingX) {
  if (typeof document === 'undefined' || !text) {
    return 0;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return 0;
  }

  context.font = measureFont;

  const characters = text.split('');
  let totalWidth = 0;

  characters.forEach((character, index) => {
    totalWidth += context.measureText(character).width;
    if (index < characters.length - 1) {
      totalWidth += characterTrackingX;
    }
  });

  return totalWidth;
}

/**
 * Resolves next/font CSS variables into concrete family names that canvas can measure.
 */
function resolveCssFontFamily(fontFamily, scopeElement) {
  const match = /^var\((--[^),]+)(?:,[^)]+)?\)$/.exec(fontFamily);

  if (!match) {
    return fontFamily;
  }

  const scopedValue = scopeElement
    ? getComputedStyle(scopeElement).getPropertyValue(match[1]).trim()
    : '';
  const rootValue = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();

  return scopedValue || rootValue;
}

/**
 * Computes a stable vertical correction so glyph ink sits centered inside each grid row.
 */
function getGridTextOffset(config) {
  const cacheKey = `${config.measureFont}__${config.lineHeight}__${config.alignmentSample}__${config.baselineShiftY ?? 0}__${config.inkOffsetY ?? 0}`;
  const cachedOffset = alignmentOffsetCache.get(cacheKey);

  if (cachedOffset !== undefined) {
    return cachedOffset;
  }

  if (typeof document === 'undefined') {
    return 0;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return 0;
  }

  context.font = config.measureFont;

  const metrics = context.measureText(config.alignmentSample);
  const actualAscent = metrics.actualBoundingBoxAscent || 0;
  const actualDescent = metrics.actualBoundingBoxDescent || 0;
  const fontAscent = metrics.fontBoundingBoxAscent || actualAscent;
  const fontDescent = metrics.fontBoundingBoxDescent || actualDescent;
  const fontHeight = fontAscent + fontDescent;
  const actualHeight = actualAscent + actualDescent;

  if (fontHeight === 0 || actualHeight === 0) {
    alignmentOffsetCache.set(cacheKey, 0);
    return 0;
  }

  const currentTopInset = (config.lineHeight - fontHeight) / 2 + (fontAscent - actualAscent);
  const desiredTopInset = (config.lineHeight - actualHeight) / 2;
  const offsetY = Math.round(desiredTopInset - currentTopInset + (config.baselineShiftY ?? 0) + (config.inkOffsetY ?? 0));

  alignmentOffsetCache.set(cacheKey, offsetY);

  return offsetY;
}
