import { useEffect, useRef } from 'react';
import { getGridSize, measurePageAndFooter } from '@/lib/gridMeasurements';

/**
 * Draws the square page grid above the footer seam and the alternating diagonal lattice inside the footer region.
 */
export default function BackgroundGridCanvas({ contentRef, footerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const doc = document;
    const root = doc.documentElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return undefined;
    }

    const draw = () => {
      const gridSize = getGridSize(doc);
      const { pageHeight, footerSeamY } = measurePageAndFooter(footerRef.current, gridSize, doc);
      const cssWidth = window.innerWidth;
      const cssHeight = Math.max(pageHeight, window.innerHeight);
      const dpr = window.devicePixelRatio || 1;
      const strokeColor = getComputedStyle(root).getPropertyValue('--grid-color').trim() || 'rgba(0, 0, 0, 0.05)';
      const gridOriginX = getGridOriginX(contentRef.current, gridSize);

      canvas.width = Math.ceil(cssWidth * dpr);
      canvas.height = Math.ceil(cssHeight * dpr);
      canvas.style.height = `${cssHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.lineWidth = 1;
      ctx.strokeStyle = strokeColor;

      drawSquareGrid(ctx, cssWidth, footerSeamY, gridSize, gridOriginX);
      drawFooterLattice(ctx, cssWidth, cssHeight, footerSeamY, gridSize, gridOriginX);
    };

    const scheduleDraw = () => {
      window.requestAnimationFrame(draw);
    };

    scheduleDraw();

    const resizeObserver = new ResizeObserver(scheduleDraw);
    if (footerRef.current) {
      resizeObserver.observe(footerRef.current);
    }
    resizeObserver.observe(doc.body);
    resizeObserver.observe(root);

    const themeObserver = new MutationObserver(scheduleDraw);
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    window.addEventListener('resize', scheduleDraw);
    window.addEventListener('load', scheduleDraw);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('resize', scheduleDraw);
      window.removeEventListener('load', scheduleDraw);
    };
  }, [contentRef, footerRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="background-grid-canvas" />;
}

/**
 * Draws the square notebook grid only until the snapped footer seam.
 */
function drawSquareGrid(ctx, width, footerSeamY, gridSize, gridOriginX) {
  const firstVisibleGridX = getFirstVisibleGridLine(gridOriginX, gridSize);

  ctx.beginPath();

  for (let x = firstVisibleGridX; x <= width + gridSize; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, footerSeamY);
  }

  for (let y = 0.5; y < footerSeamY; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
}

/**
 * Draws one alternating diagonal per seam anchor and extends each line through the footer.
 */
function drawFooterLattice(ctx, width, height, footerSeamY, gridSize, gridOriginX) {
  if (footerSeamY >= height) {
    return;
  }

  const firstVisibleGridX = getFirstVisibleGridLine(gridOriginX, gridSize);
  ctx.beginPath();

  for (let x = firstVisibleGridX, columnIndex = 0; x <= width + gridSize; x += gridSize, columnIndex += 1) {
    const direction = columnIndex % 2 === 0 ? -1 : 1;
    const deltaY = height - footerSeamY + gridSize;

    ctx.moveTo(x, footerSeamY);
    ctx.lineTo(x + direction * deltaY, height + gridSize);
  }

  ctx.stroke();
}

/**
 * Aligns the drawn grid with the centered content column so text starts on vertical grid lines.
 */
function getGridOriginX(contentElement, gridSize) {
  if (!contentElement) {
    return 0;
  }

  const { left } = contentElement.getBoundingClientRect();
  const normalizedLeft = ((left % gridSize) + gridSize) % gridSize;

  return normalizedLeft;
}

/**
 * Finds the first visible grid line so the pattern continues across the full viewport width.
 */
function getFirstVisibleGridLine(gridOriginX, gridSize) {
  let startX = gridOriginX + 0.5;

  while (startX > 0.5) {
    startX -= gridSize;
  }

  return startX;
}
