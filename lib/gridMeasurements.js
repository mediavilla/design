/**
 * Reads the CSS grid size from the root element so drawing uses the same spacing as layout.
 */
export function getGridSize(doc = document) {
  if (typeof window === 'undefined' || !doc?.documentElement) {
    return 32;
  }

  const probe = doc.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.width = 'var(--grid)';
  probe.style.height = '0';

  doc.documentElement.appendChild(probe);
  const resolvedWidth = probe.getBoundingClientRect().width;
  probe.remove();

  return Number.isFinite(resolvedWidth) && resolvedWidth > 0 ? resolvedWidth : 32;
}

/**
 * Measures the document and footer geometry, then snaps the footer seam to one pixel before the next grid line.
 */
export function measurePageAndFooter(footerEl, gridSize, doc = document) {
  const pageHeight = Math.max(
    doc.documentElement.scrollHeight,
    doc.body?.scrollHeight ?? 0,
    window.innerHeight,
  );

  if (!footerEl) {
    return {
      pageHeight,
      footerTop: pageHeight,
      footerHeight: 0,
      footerSeamY: pageHeight,
    };
  }

  const footerRect = footerEl.getBoundingClientRect();
  const footerTop = window.scrollY + footerRect.top;
  const footerHeight = footerRect.height;
  const footerSeamY = Math.ceil(footerTop / gridSize) * gridSize - 1;

  return {
    pageHeight,
    footerTop,
    footerHeight,
    footerSeamY,
  };
}
