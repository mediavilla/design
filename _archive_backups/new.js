import { useRef } from 'react';
import GridText from '@/components/GridText';
import { useGridPanelObserver } from '@/lib/useGridPanelObserver';

/**
 * Renders the experimental spec page with the same measured text system as the rest of the site.
 */
export default function Newpage() {
    const mainRef = useRef(null);

    useGridPanelObserver(mainRef);

    return (
      <main ref={mainRef} className="page">
        <div className="grid-row grid-gap-y-2">
        {/* 01 – IDENTITY */}
        <section className="grid-panel grid-start-1 grid-span-30 spec-section spec-section--top">
          <GridText as="div" variant="micro-1" className="spec-label">01 / IDENTITY</GridText>
          <div className="spec-content spec-content--two-col">
            <div>
              <GridText as="h1" variant="display-2" className="spec-title">Juan Mediavilla</GridText>
              <GridText as="p" variant="body-1" className="spec-subtitle">User experience &amp; service designer</GridText>
            </div>
            <div className="spec-meta">
              <GridText as="p" variant="micro-1">serial: MD-01</GridText>
              <GridText as="p" variant="micro-1">rev: 2025.04</GridText>
              <GridText as="p" variant="micro-1">status: active</GridText>
            </div>
          </div>
        </section>
  
        {/* 02 – WORK HISTORY */}
        <section className="grid-panel grid-start-1 grid-span-30 spec-section">
          <GridText as="div" variant="micro-1" className="spec-label">02 / WORK HISTORY</GridText>
          <div className="spec-content spec-content--split">
            <div>
              <GridText as="h2" variant="section-1" className="spec-heading">Now</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body-1">Head of Experience Design at PwC UK.</GridText>
              </ul>
            </div>
            <div>
              <GridText as="h2" variant="section-1" className="spec-heading">Before</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body-1">Dec/19 → Oct/20 · Lead UX Designer at PwC.</GridText>
                <GridText as="li" variant="body-1">Jul/17 → Nov/19 · Service Design Manager at Lloyds.</GridText>
                <GridText as="li" variant="body-1">Nov/16 → Jun/17 · UX Director at RAPP.</GridText>
              </ul>
            </div>
          </div>
        </section>
  
        {/* 03 – PROJECTS */}
        <section className="grid-panel grid-start-1 grid-span-30 spec-section">
          <GridText as="div" variant="micro-1" className="spec-label">03 / PROJECTS</GridText>
          <div className="spec-content spec-content--split">
            <div>
              <GridText as="h2" variant="section-1" className="spec-heading">Active systems</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body-1"><span className="spec-code">PJ-01</span>IMCBM — independent music charts.</GridText>
                <GridText as="li" variant="body-1"><span className="spec-code">PJ-02</span>ABC NATO — NATO alphabet translator.</GridText>
                <GridText as="li" variant="body-1"><span className="spec-code">PJ-03</span>Periodic Table experiments.</GridText>
              </ul>
            </div>
            <div className="spec-panel spec-panel--qr-placeholder">
              <GridText as="p" variant="micro-1" className="spec-micro">QR INDEX PENDING</GridText>
              <GridText as="p" variant="micro-1" className="spec-micro">scan modules will appear here</GridText>
            </div>
          </div>
        </section>
  
        {/* 04 – LINKS */}
        <section className="grid-panel grid-start-1 grid-span-30 spec-section">
          <GridText as="div" variant="micro-1" className="spec-label">04 / LINKS</GridText>
          <div className="spec-content spec-content--split">
            <div>
              <GridText as="h2" variant="section-1" className="spec-heading">About &amp; writing</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body-1">About</GridText>
                <GridText as="li" variant="body-1">Blog / Notes</GridText>
              </ul>
            </div>
            <div>
              <GridText as="h2" variant="section-1" className="spec-heading">External</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body-1">Github</GridText>
                <GridText as="li" variant="body-1">Bluesky</GridText>
              </ul>
            </div>
          </div>
        </section>
  
        {/* 05 – MICRODATA */}
        <section className="grid-panel grid-start-1 grid-span-30 spec-section spec-section--bottom">
          <GridText as="div" variant="micro-1" className="spec-label">05 / MICRODATA</GridText>
          <div className="spec-content spec-content--meta-bar">
            <GridText as="span" variant="micro-1">© {new Date().getFullYear()} mediavilla.design</GridText>
            <GridText as="span" variant="micro-1">location: london, uk</GridText>
            <GridText as="span" variant="micro-1">checksum: ok</GridText>
          </div>
        </section>
        </div>
      </main>
    );
  }
