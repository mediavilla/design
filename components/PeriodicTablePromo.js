import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import GridText from '@/components/GridText';
import BohrAtom from '@/components/BohrAtom';
import promoElements from '@/data/promoElements';

const SITE_URL = 'https://www.periodictable.education/';
const ABOUT_URL = 'https://www.periodictable.education/about/';
const DEFAULT_NUMBER = 2;
const AUTOPLAY_INTERVAL_MS = 3000;
const IDLE_RESUME_MS = 30000;

const elementsByNumber = Object.fromEntries(
  promoElements.map((element) => [element.number, element]),
);

/**
 * Picks a random atomic number, avoiding a repeat of the current one.
 */
function pickRandomElementNumber(currentNumber) {
  const count = promoElements.length;

  if (count === 0) {
    return currentNumber;
  }

  if (count === 1) {
    return promoElements[0].number;
  }

  let next = currentNumber;

  while (next === currentNumber) {
    next = promoElements[Math.floor(Math.random() * count)].number;
  }

  return next;
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <SquareArrowOutUpRight aria-hidden="true" />
    </a>
  );
}

/**
 * Grid-aligned promo block for periodictable.education with a full wireframe table
 * and a Bohr shell preview that follows hover, tap, or a random autoplay cycle.
 */
export default function PeriodicTablePromo() {
  const [activeNumber, setActiveNumber] = useState(DEFAULT_NUMBER);
  const pointerInside = useRef(false);
  const activeNumberRef = useRef(DEFAULT_NUMBER);
  const autoplayTimer = useRef(null);
  const idleTimer = useRef(null);
  const activeElement = useMemo(
    () => elementsByNumber[activeNumber] || elementsByNumber[DEFAULT_NUMBER],
    [activeNumber],
  );

  const selectElement = useCallback((number) => {
    activeNumberRef.current = number;
    setActiveNumber(number);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  const stopIdle = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopIdle();
    stopAutoplay();

    const tick = () => {
      const next = pickRandomElementNumber(activeNumberRef.current);
      selectElement(next);
    };

    tick();
    autoplayTimer.current = setInterval(tick, AUTOPLAY_INTERVAL_MS);
  }, [selectElement, stopAutoplay, stopIdle]);

  const scheduleIdleResume = useCallback(() => {
    stopIdle();
    idleTimer.current = setTimeout(() => {
      if (pointerInside.current) {
        scheduleIdleResume();
        return;
      }

      startAutoplay();
    }, IDLE_RESUME_MS);
  }, [startAutoplay, stopIdle]);

  const pauseForUser = useCallback((number) => {
    stopAutoplay();

    if (number != null) {
      selectElement(number);
    }

    scheduleIdleResume();
  }, [scheduleIdleResume, selectElement, stopAutoplay]);

  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
      stopIdle();
    };
  }, [startAutoplay, stopAutoplay, stopIdle]);

  const handleTablePointerEnter = useCallback(() => {
    pointerInside.current = true;
    stopAutoplay();
    scheduleIdleResume();
  }, [scheduleIdleResume, stopAutoplay]);

  const handlePointerEnter = useCallback((event, number) => {
    pointerInside.current = true;

    if (event.pointerType === 'mouse') {
      pauseForUser(number);
    }
  }, [pauseForUser]);

  const handlePointerDown = useCallback((event, number) => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      pointerInside.current = true;
      pauseForUser(number);
    }
  }, [pauseForUser]);

  const handlePointerLeaveTable = useCallback(() => {
    pointerInside.current = false;
    scheduleIdleResume();
  }, [scheduleIdleResume]);

  const handleFocus = useCallback((number) => {
    pauseForUser(number);
  }, [pauseForUser]);

  const handleBlur = useCallback((event) => {
    const next = event.relatedTarget;

    if (next && event.currentTarget.contains(next)) {
      return;
    }

    pointerInside.current = false;
    scheduleIdleResume();
  }, [scheduleIdleResume]);

  return (
    <section className="periodic-table-promo">
      <a
        href={SITE_URL}
        className="periodic-table-promo__title-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GridText as="h2" variant="geistPixelLine-2" singleLineFit>
          WWW.PERIODICTABLE.EDUCATION
        </GridText>
      </a>

      <div className="layout-columns layout-columns--2">
        <div
          className="periodic-table-promo__table"
          role="group"
          aria-label="Periodic table preview. Hover or focus an element to see its shell model."
          onPointerEnter={handleTablePointerEnter}
          onPointerLeave={handlePointerLeaveTable}
          onBlur={handleBlur}
        >
          {promoElements.map((element) => {
            const isActive = element.number === activeElement.number;

            return (
              <button
                key={element.number}
                type="button"
                className={`periodic-table-promo__cell${isActive ? ' periodic-table-promo__cell--filled' : ''}`}
                style={{ gridColumn: element.column, gridRow: element.row }}
                aria-label={`${element.name}, ${element.number}`}
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                onPointerEnter={(event) => handlePointerEnter(event, element.number)}
                onPointerDown={(event) => handlePointerDown(event, element.number)}
                onFocus={() => handleFocus(element.number)}
              />
            );
          })}

          <div className="periodic-table-promo__atom" aria-hidden="true">
            <BohrAtom
              shells={activeElement.shells}
              symbol={activeElement.symbol}
              name={activeElement.name}
            />
          </div>
        </div>

        <div className="periodic-table-promo__copy">
          <GridText as="p" variant="geistMono-1">BUILDING IN PUBLIC</GridText>
          <GridText as="p" variant="geistMonoMedium-1">LAUNCHED ON SEPT 2026</GridText>
          <div className="grid-spacer" aria-hidden="true" />
          <GridText as="p" variant="geistPixelSquare-1">
            Explore the history and different designs of the periodic table and the elements.
            <br /><br />
            Read more on the <ExternalLink href={ABOUT_URL}>About</ExternalLink> page and visit the{' '}
            <ExternalLink href={SITE_URL}>website</ExternalLink>.
          </GridText>
        </div>
      </div>
    </section>
  );
}
