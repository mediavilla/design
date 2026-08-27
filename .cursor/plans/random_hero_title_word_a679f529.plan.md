---
name: Random hero title word
overview: Let HeroBannerLayout accept a list of words and display a randomly chosen one on each visit, picked after mount to stay hydration-safe with the static export.
todos:
  - id: component-prop
    content: Add titleWords prop with hydration-safe random pick to HeroBannerLayout
    status: completed
  - id: page-usage
    content: Add HERO_WORDS array to new-home.js and pass it to the hero
    status: completed
isProject: false
---

# Random Word Hero Title

## Approach

Add an optional `titleWords` prop (array of strings) to `HeroBannerLayout` in [components/GridLayoutOptions.js](components/GridLayoutOptions.js). When provided, the component picks a random entry; otherwise it behaves exactly as today with the `title` prop.

Because the site uses `output: 'export'` (static HTML), picking randomly during render would cause a React hydration mismatch. So the component renders the first word for the initial paint and swaps to a random one in a `useEffect` on mount:

```jsx
import { useEffect, useState } from 'react';

export function HeroBannerLayout({
  title = 'Hero Banner',
  titleWords,            // e.g. ['Hey', 'Hola', 'Ciao']
  titleVariant = 'display-2',
  copy = ...,
  copyVariant = 'body-1',
}) {
  const [randomTitle, setRandomTitle] = useState(titleWords?.[0]);

  useEffect(() => {
    if (titleWords?.length) {
      setRandomTitle(titleWords[Math.floor(Math.random() * titleWords.length)]);
    }
  }, [titleWords]);

  const shownTitle = titleWords?.length ? randomTitle : title;
  // <GridText as="h2" variant={titleVariant}>{shownTitle}</GridText>
}
```

`GridText` re-measures when its text changes, so the grid-aligned height stays correct after the swap.

## Usage in [pages/new-home.js](pages/new-home.js)

Define the list as a constant at the top of the page (easy to edit) and pass it in:

```jsx
const HERO_WORDS = ['Hey', 'Hola', 'Ciao', 'Hallo', 'Ola'];

<HeroBannerLayout titleWords={HERO_WORDS} titleVariant="dotmatrix-7" ... />
```

## Notes

- On each page load the first word appears for a brief moment before the random one replaces it (unavoidable with static export unless we render nothing until mounted — flashing the first word looks better than a blank title).
- To avoid the swap being visible at all, the array can be ordered so the most common greeting is first.
- If DotMatrix is used (`dotmatrix-7`), keep the words uppercase-friendly.
