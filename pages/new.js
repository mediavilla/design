// app/page.tsx
export default function Newpage() {
    return (
      <main className="page">
        {/* 01 – IDENTITY */}
        <section className="spec-section spec-section--top">
          <div className="spec-label">01 / IDENTITY</div>
          <div className="spec-content spec-content--two-col">
            <div>
              <h1 className="spec-title">Juan Mediavilla</h1>
              <p className="spec-subtitle">User experience &amp; service designer</p>
            </div>
            <div className="spec-meta">
              <p>serial: MD-01</p>
              <p>rev: 2025.04</p>
              <p>status: active</p>
            </div>
          </div>
        </section>
  
        {/* 02 – WORK HISTORY */}
        <section className="spec-section">
          <div className="spec-label">02 / WORK HISTORY</div>
          <div className="spec-content spec-content--split">
            <div>
              <h2 className="spec-heading">Now</h2>
              <ul className="spec-list">
                <li>Head of Experience Design at PwC UK.</li>
              </ul>
            </div>
            <div>
              <h2 className="spec-heading">Before</h2>
              <ul className="spec-list">
                <li>Dec/19 → Oct/20 · Lead UX Designer at PwC.</li>
                <li>Jul/17 → Nov/19 · Service Design Manager at Lloyds.</li>
                <li>Nov/16 → Jun/17 · UX Director at RAPP.</li>
              </ul>
            </div>
          </div>
        </section>
  
        {/* 03 – PROJECTS */}
        <section className="spec-section">
          <div className="spec-label">03 / PROJECTS</div>
          <div className="spec-content spec-content--split">
            <div>
              <h2 className="spec-heading">Active systems</h2>
              <ul className="spec-list">
                <li><span className="spec-code">PJ-01</span>IMCBM — independent music charts.</li>
                <li><span className="spec-code">PJ-02</span>ABC NATO — NATO alphabet translator.</li>
                <li><span className="spec-code">PJ-03</span>Periodic Table experiments.</li>
              </ul>
            </div>
            <div className="spec-panel spec-panel--qr-placeholder">
              <p className="spec-micro">QR INDEX PENDING</p>
              <p className="spec-micro">scan modules will appear here</p>
            </div>
          </div>
        </section>
  
        {/* 04 – LINKS */}
        <section className="spec-section">
          <div className="spec-label">04 / LINKS</div>
          <div className="spec-content spec-content--split">
            <div>
              <h2 className="spec-heading">About &amp; writing</h2>
              <ul className="spec-list">
                <li>About</li>
                <li>Blog / Notes</li>
              </ul>
            </div>
            <div>
              <h2 className="spec-heading">External</h2>
              <ul className="spec-list">
                <li>Github</li>
                <li>Bluesky</li>
              </ul>
            </div>
          </div>
        </section>
  
        {/* 05 – MICRODATA */}
        <section className="spec-section spec-section--bottom">
          <div className="spec-label">05 / MICRODATA</div>
          <div className="spec-content spec-content--meta-bar">
            <span>© {new Date().getFullYear()} mediavilla.design</span>
            <span>location: london, uk</span>
            <span>checksum: ok</span>
          </div>
        </section>
      </main>
    );
  }