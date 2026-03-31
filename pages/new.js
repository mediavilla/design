import GridText from '@/components/GridText';

/**
 * Renders the experimental spec page with the same measured text system as the rest of the site.
 */
export default function Newpage() {
    return (
      <main className="page">
        {/* 01 – IDENTITY */}
        <section className="spec-section spec-section--top">
          <GridText as="div" variant="micro" className="spec-label">01 / IDENTITY</GridText>
          <div className="spec-content spec-content--two-col">
            <div>
              <GridText as="h1" variant="display" className="spec-title">Juan Mediavilla</GridText>
              <GridText as="p" variant="body" className="spec-subtitle">User experience &amp; service designer</GridText>
            </div>
            <div className="spec-meta">
              <GridText as="p" variant="micro">serial: MD-01</GridText>
              <GridText as="p" variant="micro">rev: 2025.04</GridText>
              <GridText as="p" variant="micro">status: active</GridText>
            </div>
          </div>
        </section>
  
        {/* 02 – WORK HISTORY */}
        <section className="spec-section">
          <GridText as="div" variant="micro" className="spec-label">02 / WORK HISTORY</GridText>
          <div className="spec-content spec-content--split">
            <div>
              <GridText as="h2" variant="section" className="spec-heading">Now</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body">Head of Experience Design at PwC UK.</GridText>
              </ul>
            </div>
            <div>
              <GridText as="h2" variant="section" className="spec-heading">Before</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body">Dec/19 → Oct/20 · Lead UX Designer at PwC.</GridText>
                <GridText as="li" variant="body">Jul/17 → Nov/19 · Service Design Manager at Lloyds.</GridText>
                <GridText as="li" variant="body">Nov/16 → Jun/17 · UX Director at RAPP.</GridText>
              </ul>
            </div>
          </div>
        </section>
  
        {/* 03 – PROJECTS */}
        <section className="spec-section">
          <GridText as="div" variant="micro" className="spec-label">03 / PROJECTS</GridText>
          <div className="spec-content spec-content--split">
            <div>
              <GridText as="h2" variant="section" className="spec-heading">Active systems</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body"><span className="spec-code">PJ-01</span>IMCBM — independent music charts.</GridText>
                <GridText as="li" variant="body"><span className="spec-code">PJ-02</span>ABC NATO — NATO alphabet translator.</GridText>
                <GridText as="li" variant="body"><span className="spec-code">PJ-03</span>Periodic Table experiments.</GridText>
              </ul>
            </div>
            <div className="spec-panel spec-panel--qr-placeholder">
              <GridText as="p" variant="micro" className="spec-micro">QR INDEX PENDING</GridText>
              <GridText as="p" variant="micro" className="spec-micro">scan modules will appear here</GridText>
            </div>
          </div>
        </section>
  
        {/* 04 – LINKS */}
        <section className="spec-section">
          <GridText as="div" variant="micro" className="spec-label">04 / LINKS</GridText>
          <div className="spec-content spec-content--split">
            <div>
              <GridText as="h2" variant="section" className="spec-heading">About &amp; writing</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body">About</GridText>
                <GridText as="li" variant="body">Blog / Notes</GridText>
              </ul>
            </div>
            <div>
              <GridText as="h2" variant="section" className="spec-heading">External</GridText>
              <ul className="spec-list">
                <GridText as="li" variant="body">Github</GridText>
                <GridText as="li" variant="body">Bluesky</GridText>
              </ul>
            </div>
          </div>
        </section>
  
        {/* 05 – MICRODATA */}
        <section className="spec-section spec-section--bottom">
          <GridText as="div" variant="micro" className="spec-label">05 / MICRODATA</GridText>
          <div className="spec-content spec-content--meta-bar">
            <GridText as="span" variant="micro">© {new Date().getFullYear()} mediavilla.design</GridText>
            <GridText as="span" variant="micro">location: london, uk</GridText>
            <GridText as="span" variant="micro">checksum: ok</GridText>
          </div>
        </section>
      </main>
    );
  }
