import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function TopBar({ title = 'Juan Mediavilla', showTitleLink = false }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const titleElement = <h1>{title}</h1>;

  return (
    <header className={`top-bar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="top-bar-inner">
        {showTitleLink ? (
          <Link href="/" className="title-link">{titleElement}</Link>
        ) : (
          titleElement
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--grid) * 0.5)' }}>
          <Link href="/about">About</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

