import { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Renders the shared footer and exposes its DOM node for page-level grid measurements.
 */
const Footer = forwardRef(function Footer({ showLink = false }, ref) {
  const router = useRouter();
  const isIndexPage = router.pathname === '/';
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (theme === 'light') {
      setIsGlitching(true);
      setIsHovered(true);
      // Reset glitch animation after it completes
      setTimeout(() => setIsGlitching(false), 400);
    } else if (theme === 'dark') {
      // Dark mode glitch on all pages (including index)
      setIsGlitching(true);
      // Only change image if not on index page
      if (!isIndexPage) {
        setIsHovered(true);
      }
      // Reset glitch animation after it completes
      setTimeout(() => setIsGlitching(false), 400);
    } else {
      setIsHovered(true);
    }
  };

  const logoSrc = mounted 
    ? (theme === 'dark' 
        ? (isHovered && !isIndexPage 
            ? '/mediavilla-logo-dark-hover.png' 
            : '/mediavilla-logo-dark.png')
        : (isHovered ? '/mediavilla-logo-light-hover.png' : '/mediavilla-logo-light.png'))
    : '/mediavilla-logo-dark.png';

  const logoImage = (
    <div 
      className={isGlitching ? (theme === 'dark' ? 'logo-glitch logo-glitch-dark' : 'logo-glitch') : ''}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'inline-block' }}
    >
      <Image 
        src={logoSrc} 
        height="200" 
        width="200" 
        alt="logo"
      />
    </div>
  );

  return (
    <footer ref={ref}>
      {showLink ? (
        <Link href="/" className="footer-logo-link">{logoImage}</Link>
      ) : (
        logoImage
      )}
    </footer>
  );
});

export default Footer;
