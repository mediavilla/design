---
name: Layout options page margins
overview: Give the layout-options page a main container with 2-cell side margins (1 cell on mobile), and refactor the demo sections into full-width 2, 3 and 4 column layouts with 2-cell gutters.
todos:
  - id: css-utilities
    content: Add .grid-container and .layout-columns utilities with mobile overrides in globals.css
    status: completed
  - id: refactor-components
    content: Refactor GridLayoutOptions.js components to full-width layouts and add FourColumnMediaLayout
    status: completed
  - id: update-page
    content: Apply grid-container to all panels in layout-options.js and render the 4-column section
    status: completed
isProject: false
---

# Layout Options Page: Container Margins and Column Demos

## Context

The page grid is 50 cells wide (`--page-columns: 50` in [styles/globals.css](styles/globals.css)). With 2-cell margins the content area is 46 cells, which divides perfectly with 2-cell gutters:

- 2 columns: 22 + 2 + 22
- 3 columns: 14 + 2 + 14 + 2 + 14
- 4 columns: 10 + 2 + 10 + 2 + 10 + 2 + 10

The mobile breakpoint is `max-width: 768px` (see [styles/mediaqueries.css](styles/mediaqueries.css)), where margins become 1 cell (48-cell content area) and the demo columns stack vertically, since 48 cells does not divide evenly into 3 or 4 grid-aligned columns.

## Changes

### 1. CSS utilities in [styles/globals.css](styles/globals.css)

- Add a `.grid-container` class for children of `.grid-row` using negative line numbers so it responds automatically:

```css
.grid-row > .grid-container {
    grid-column: 3 / -3;   /* 2-cell margins */
}
@media (max-width: 768px) {
    .grid-row > .grid-container {
        grid-column: 2 / -2;   /* 1-cell margins */
    }
}
```

- Add `.layout-columns` with `--2`, `--3`, `--4` modifiers for the inner column layouts. Because the parent is grid-aligned, `1fr` tracks with a 2-cell gap land exactly on grid cells:

```css
.layout-columns {
    display: grid;
    column-gap: calc(var(--grid) * 2);
}
.layout-columns--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.layout-columns--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.layout-columns--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
@media (max-width: 768px) {
    .layout-columns--2, .layout-columns--3, .layout-columns--4 {
        grid-template-columns: minmax(0, 1fr);
        row-gap: calc(var(--grid) * 2);
    }
}
```

### 2. Refactor [components/GridLayoutOptions.js](components/GridLayoutOptions.js)

- Remove the internal `.grid-row` wrappers, hardcoded `grid-start-*`/`grid-span-*` classes, and `.grid-gap-x-1` spacer divs — the components will fill whatever container they sit in.
- `HeroBannerLayout`: single full-width block.
- `TwoColumnMediaLayout`: `.layout-columns layout-columns--2` with two image+copy cells.
- `ThreeColumnMediaLayout`: `.layout-columns layout-columns--3` with three cells.
- New `FourColumnMediaLayout`: `.layout-columns layout-columns--4` with four dummy image+copy cells reusing existing images in `public/`.

### 3. Update [pages/layout-options.js](pages/layout-options.js)

- Replace `grid-start-1 grid-span-full` / `grid-start-1 grid-span-30` on the page panels with the new `grid-container` class so all content (intro text block and demo sections) shares the same 2-cell margins (1 on mobile).
- Add a fourth panel rendering `FourColumnMediaLayout`.
