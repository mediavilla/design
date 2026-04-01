import { useEffect } from 'react';
import { getGridSize } from '@/lib/gridMeasurements';

/**
 * Snaps any measured size up to the next full grid unit.
 */
export function snapSizeToGrid(size, gridSize) {
  if (!size || size <= 0) {
    return 0;
  }

  return Math.ceil(size / gridSize) * gridSize;
}

/**
 * Keeps every `.grid-panel` inside a page root aligned to the next horizontal grid line.
 */
export function useGridPanelObserver(rootRef) {
  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const doc = root.ownerDocument;
    const win = doc.defaultView ?? window;
    let frameId = 0;
    let isApplyingPanelHeights = false;

    const getPanels = () => Array.from(root.querySelectorAll('.grid-panel'));

    const applyPanelHeights = () => {
      frameId = 0;
      const panels = getPanels();

      if (!panels.length) {
        return;
      }

      const gridSize = getGridSize(doc);
      isApplyingPanelHeights = true;

      panels.forEach((panel) => {
        panel.style.height = 'auto';
      });

      panels.forEach((panel) => {
        const contentHeight = Math.ceil(panel.scrollHeight);
        const snappedHeight = snapSizeToGrid(contentHeight, gridSize);

        if (snappedHeight > 0) {
          panel.style.height = `${snappedHeight}px`;
          return;
        }

        panel.style.removeProperty('height');
      });

      win.requestAnimationFrame(() => {
        isApplyingPanelHeights = false;
      });
    };

    const schedulePanelHeights = () => {
      if (frameId) {
        win.cancelAnimationFrame(frameId);
      }

      frameId = win.requestAnimationFrame(applyPanelHeights);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (isApplyingPanelHeights) {
        return;
      }

      schedulePanelHeights();
    });

    const refreshObservedElements = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(root);

      getPanels().forEach((panel) => {
        resizeObserver.observe(panel);
        Array.from(panel.children).forEach((child) => {
          resizeObserver.observe(child);
        });
      });
    };

    const mutationObserver = new MutationObserver(() => {
      refreshObservedElements();
      schedulePanelHeights();
    });

    refreshObservedElements();
    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const handleFontsReady = () => {
      schedulePanelHeights();
    };

    if (doc.fonts?.addEventListener) {
      doc.fonts.addEventListener('loadingdone', handleFontsReady);
    } else if (doc.fonts?.ready) {
      doc.fonts.ready.then(handleFontsReady);
    }

    win.addEventListener('resize', schedulePanelHeights);
    win.addEventListener('load', schedulePanelHeights);
    schedulePanelHeights();

    return () => {
      if (frameId) {
        win.cancelAnimationFrame(frameId);
      }

      resizeObserver.disconnect();
      mutationObserver.disconnect();
      win.removeEventListener('resize', schedulePanelHeights);
      win.removeEventListener('load', schedulePanelHeights);

      if (doc.fonts?.removeEventListener) {
        doc.fonts.removeEventListener('loadingdone', handleFontsReady);
      }
    };
  }, [rootRef]);
}
