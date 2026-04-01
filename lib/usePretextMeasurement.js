import { useEffect, useMemo, useRef, useState } from 'react';
import { layout, prepare } from '@chenglou/pretext';
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
  const [measurement, setMeasurement] = useState({
    height: 0,
    lineCount: 0,
    offsetY: 0,
    ready: false,
  });
  const config = useMemo(() => getTypographyVariant(variant), [variant]);
  const { alignmentSample, baselineShiftY, lineHeight, measureFont } = config;
  const effectiveWhiteSpace = whiteSpace ?? config.whiteSpace;

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setWidth(nextWidth);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function measureText() {
      if (!text || width <= 0) {
        setMeasurement({
          height: 0,
          lineCount: text ? 1 : 0,
          offsetY: getGridTextOffset({ alignmentSample, baselineShiftY, lineHeight, measureFont }),
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

      const cacheKey = `${measureFont}__${effectiveWhiteSpace}__${text}`;
      let prepared = preparedTextCache.get(cacheKey);

      if (!prepared) {
        prepared = prepare(text, measureFont, { whiteSpace: effectiveWhiteSpace });
        preparedTextCache.set(cacheKey, prepared);
      }

      const result = layout(prepared, width, lineHeight);
      const offsetY = getGridTextOffset({ alignmentSample, baselineShiftY, lineHeight, measureFont });

      if (cancelled) {
        return;
      }

      setMeasurement({
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
  }, [alignmentSample, baselineShiftY, effectiveWhiteSpace, lineHeight, measureFont, text, variant, width]);

  return {
    elementRef,
    lineCount: measurement.lineCount,
    height: measurement.height,
    offsetY: measurement.offsetY,
    ready: measurement.ready,
  };
}

/**
 * Computes a stable vertical correction so glyph ink sits centered inside each grid row.
 */
function getGridTextOffset(config) {
  const cacheKey = `${config.measureFont}__${config.lineHeight}__${config.alignmentSample}__${config.baselineShiftY ?? 0}`;
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
  const offsetY = Math.round(desiredTopInset - currentTopInset + (config.baselineShiftY ?? 0));

  alignmentOffsetCache.set(cacheKey, offsetY);

  return offsetY;
}
