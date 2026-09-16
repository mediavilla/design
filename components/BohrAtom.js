import { useEffect, useState } from 'react';

const VIEWBOX = 100;
const CENTER = VIEWBOX / 2;
/** Max shells in the table (Oganesson); radii stay fixed so heavy atoms fill the frame. */
const MAX_SHELLS = 7;
/** Innermost orbit radius as a fraction of half the viewBox. */
const INNER_RADIUS_RATIO = 0.22;
/** Outer padding so the outermost ring stays inside the viewBox. */
const OUTER_PADDING = 4;
const ELECTRON_RADIUS = 1.6;
const NUCLEUS_RADIUS = 6;
/** Innermost shell period; outer shells are only slightly faster. */
const BASE_ORBIT_SECONDS = 48;

const OUTER_RADIUS = CENTER - OUTER_PADDING;
const INNER_RADIUS = CENTER * INNER_RADIUS_RATIO;
const SHELL_STEP = (OUTER_RADIUS - INNER_RADIUS) / (MAX_SHELLS - 1);

/**
 * Builds evenly spaced electron positions on a circle of the given radius.
 */
function electronPositions(count, radius) {
  const positions = [];

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
    });
  }

  return positions;
}

/**
 * Stylized Bohr shell model: one SVG, shells rotate around the nucleus.
 */
export default function BohrAtom({ shells = [], symbol = '', name = '', paused = false }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const freeze = paused || reducedMotion;
  const shellSummary = shells.join(', ') || '0';
  const label = `${name || symbol}: ${shellSummary} electrons in successive shells`;

  return (
    <svg
      className={`bohr-atom${freeze ? ' bohr-atom--paused' : ''}`}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      role="img"
      aria-label={label}
    >
      <circle
        className="bohr-atom__nucleus"
        cx={CENTER}
        cy={CENTER}
        r={NUCLEUS_RADIUS}
      />
      {symbol ? (
        <text
          className="bohr-atom__symbol"
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {symbol}
        </text>
      ) : null}
      {shells.map((population, shellIndex) => {
        const radius = INNER_RADIUS + SHELL_STEP * shellIndex;
        const duration = BASE_ORBIT_SECONDS / (1 + shellIndex * 0.2);
        const electrons = electronPositions(population, radius);

        return (
          <g
            key={`shell-${shellIndex}`}
            className="bohr-atom__shell"
            style={{ animationDuration: `${duration}s` }}
          >
            <circle
              className="bohr-atom__orbit"
              cx={CENTER}
              cy={CENTER}
              r={radius}
            />
            {electrons.map((electron, electronIndex) => (
              <circle
                key={`e-${shellIndex}-${electronIndex}`}
                className="bohr-atom__electron"
                cx={electron.x}
                cy={electron.y}
                r={ELECTRON_RADIUS}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
