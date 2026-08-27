import { useEffect, useMemo, useRef, useState } from 'react';
import { layout, prepare } from '@chenglou/pretext';
import { getGridSize } from '@/lib/gridMeasurements';
import { getTypographyVariant } from '@/lib/pretextTypography';

const preparedTextCache = new Map();
const alignmentOffsetCache = new Map();
const loggedMismatches = new Set();

/**
 * Measures text with Pretext after mount, caches the expensive prepare step, and reruns only layout on resize.
 */
export function usePretextMeasurement({ text, variant, whiteSpace }) {
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [gridSize, setGridSize] = useState(32);
  const [measurement, setMeasurement] = useState({
    cssFont: undefined,
    height: 0,
    lineCount: 0,
    offsetY: 0,
    ready: false,
  });
  const config = useMemo(() => getTypographyVariant(variant, gridSize), [gridSize, variant]);
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

    readGridSize();

    const resizeObserver = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setWidth(nextWidth);
      readGridSize();
    });

    resizeObserver.observe(element);
    resizeObserver.observe(document.documentElement);
    window.addEventListener('resize', readGridSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', readGridSize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function measureText() {
      if (!text || width <= 0) {
        const resolvedConfig = resolveInkFitConfig(config, elementRef.current, text);
        setMeasurement({
          cssFont: resolvedConfig.cssFont,
          height: 0,
          lineCount: text ? 1 : 0,
          offsetY: getGridTextOffset(resolvedConfig),
          ready: true,
        });
        return;
      }

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      if (cancelled) {
        return;
      }

      const resolvedConfig = resolveInkFitConfig(config, elementRef.current, text);
      const cacheKey = `${resolvedConfig.measureFont}__${effectiveWhiteSpace}__${text}`;
      let prepared = preparedTextCache.get(cacheKey);

      if (!prepared) {
        prepared = prepare(text, resolvedConfig.measureFont, { whiteSpace: effectiveWhiteSpace });
        preparedTextCache.set(cacheKey, prepared);
      }

      const result = layout(prepared, width, resolvedConfig.lineHeight);
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
            // Helps catch drift between the CSS font shorthand and the Pretext font shorthand.
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
  }, [alignmentSample, baselineShiftY, config, effectiveWhiteSpace, inkOffsetY, lineHeight, measureFont, text, variant, width]);

  return {
    config,
    cssFont: measurement.cssFont ?? config.cssFont,
    elementRef,
    lineCount: measurement.lineCount,
    height: measurement.height,
    offsetY: measurement.offsetY,
    ready: measurement.ready,
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
