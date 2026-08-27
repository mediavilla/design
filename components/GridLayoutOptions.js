import { useEffect, useState } from 'react';
import Image from 'next/image';
import GridText from '@/components/GridText';

/**
 * Full-width single-column block that can be reused as a hero/banner row.
 * Pass titleWords to pick a random title after mount (hydration-safe).
 */
export function HeroBannerLayout({
  title = 'Hero Banner',
  titleWords,
  titleVariant = 'display-2',
  copy = 'Single column, full width.',
  copyVariant = 'body-1',
}) {
  const [randomTitle, setRandomTitle] = useState(titleWords?.[0]);

  useEffect(() => {
    if (titleWords?.length) {
      setRandomTitle(titleWords[Math.floor(Math.random() * titleWords.length)]);
    }
  }, [titleWords]);

  const shownTitle = titleWords?.length ? randomTitle : title;

  return (
    <section className="layout-demo-panel layout-demo-panel--hero hatch--horizontal hatch--thick">
      <GridText as="h2" variant={titleVariant} singleLineFit>{shownTitle}</GridText>
      <GridText as="p" variant={copyVariant}>{copy}</GridText>
    </section>
  );
}

function MediaColumn({
  src,
  alt = 'Layout placeholder image',
  title,
  copy,
  contain = false,
  sizes = '(max-width: 768px) 100vw, 33vw',
  hatch = '',
}) {
  return (
    <div className={`layout-demo-panel${hatch ? ` ${hatch}` : ''}`}>
      <div className="layout-demo-image-frame">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={contain ? 'layout-demo-image layout-demo-image--contain' : 'layout-demo-image'}
        />
      </div>
      <div className="layout-demo-copy">
        <GridText as="h3" variant="section-1">{title}</GridText>
        <GridText as="p" variant="body-1">{copy}</GridText>
      </div>
    </div>
  );
}

/**
 * Two equal columns filling the parent width with a 2-cell gutter.
 */
export function TwoColumnMediaLayout({
  leftTitle = 'Left 50%',
  leftCopy = 'Image block with supporting text below.',
  rightTitle = 'Right 50%',
  rightCopy = 'Another 50% column using the same structure.',
}) {
  return (
    <section className="layout-columns layout-columns--2">
      <MediaColumn
        src="/banner.png"
        title={leftTitle}
        copy={leftCopy}
        sizes="(max-width: 768px) 100vw, 50vw"
        hatch="hatch--diagonal-right hatch--medium"
      />
      <MediaColumn
        src="/banner-logo.png"
        title={rightTitle}
        copy={rightCopy}
        sizes="(max-width: 768px) 100vw, 50vw"
        hatch="hatch--diagonal-right hatch--medium"
      />
    </section>
  );
}

/**
 * Three equal columns filling the parent width with 2-cell gutters.
 */
export function ThreeColumnMediaLayout() {
  return (
    <section className="layout-columns layout-columns--3">
      <MediaColumn
        src="/mediavilla-logo-light.png"
        title="Column 1"
        copy="Image and text below in a full-width third."
        contain
        hatch="hatch--vertical hatch--thin"
      />
      <MediaColumn
        src="/mediavilla-logo-dark.png"
        title="Column 2"
        copy="Same pattern, same width, reusable structure."
        contain
        hatch="hatch--vertical hatch--thin"
      />
      <MediaColumn
        src="/logo-qr.png"
        title="Column 3"
        copy="Third equal column with image then text."
        contain
        hatch="hatch--vertical hatch--thin"
      />
    </section>
  );
}

/**
 * Four equal columns filling the parent width with 2-cell gutters.
 */
export function FourColumnMediaLayout() {
  return (
    <section className="layout-columns layout-columns--4">
      <MediaColumn
        src="/banner.png"
        title="Column 1"
        copy="Four-column layout cell."
        sizes="(max-width: 768px) 100vw, 25vw"
        hatch="hatch--diagonal-left hatch--thick"
      />
      <MediaColumn
        src="/banner-logo.png"
        title="Column 2"
        copy="Equal width with 2-cell gutters."
        sizes="(max-width: 768px) 100vw, 25vw"
        hatch="hatch--diagonal-left hatch--thick"
      />
      <MediaColumn
        src="/mediavilla-logo-light.png"
        title="Column 3"
        copy="Fills the parent container."
        contain
        sizes="(max-width: 768px) 100vw, 25vw"
        hatch="hatch--diagonal-left hatch--thick"
      />
      <MediaColumn
        src="/logo-qr.png"
        title="Column 4"
        copy="Stacks on mobile."
        contain
        sizes="(max-width: 768px) 100vw, 25vw"
        hatch="hatch--diagonal-left hatch--thick"
      />
    </section>
  );
}
