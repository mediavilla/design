import { useCallback, useEffect, useRef, useState } from 'react';
import GridText from '@/components/GridText';
import { getGridSize } from '@/lib/gridMeasurements';
import styles from '@/styles/Snake.module.css';

const DIRECTIONS = {
  UP: { x: 0, y: -1, key: 'UP' },
  DOWN: { x: 0, y: 1, key: 'DOWN' },
  LEFT: { x: -1, y: 0, key: 'LEFT' },
  RIGHT: { x: 1, y: 0, key: 'RIGHT' },
};

const OPPOSITE = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const TICK_MS = 160;
const SWIPE_THRESHOLD = 24;
const INITIAL_LENGTH = 5;

/**
 * Returns playable column/row counts for the current container width.
 */
function getBoardDimensions(containerWidth, gridSize) {
  const totalCols = Math.round(containerWidth / gridSize);
  const cols = Math.max(8, totalCols - 2);
  const rows = 22;
  return { cols, rows };
}

function createInitialSnake(cols, rows, direction = 'RIGHT') {
  const y = rows - 4;
  const startX = Math.floor(cols / 2) - Math.floor(INITIAL_LENGTH / 2);
  const segments = [];

  for (let i = 0; i < INITIAL_LENGTH; i += 1) {
    segments.push({ x: startX + i, y });
  }

  if (direction === 'RIGHT' || direction === 'DOWN') {
    return segments.reverse();
  }

  return segments;
}

function spawnFood(snake, cols, rows) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const freeCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  return freeCells[Math.floor(Math.random() * freeCells.length)];
}

function segmentsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

/**
 * Reusable grid-aligned Snake game. Drop anywhere with `<Snake />`.
 */
export default function Snake() {
  const shellRef = useRef(null);
  const boardRef = useRef(null);
  const statusRef = useRef('idle');
  const directionRef = useRef('RIGHT');
  const directionQueueRef = useRef([]);
  const tickRef = useRef(null);
  const foodRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [cols, setCols] = useState(44);
  const [rows] = useState(22);
  const [snake, setSnake] = useState(() => createInitialSnake(44, 22));
  const [food, setFood] = useState(() => spawnFood(createInitialSnake(44, 22), 44, 22));
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  statusRef.current = status;
  foodRef.current = food;

  const resetGame = useCallback((nextCols, nextRows) => {
    const initialDirection = directionRef.current || 'RIGHT';
    const initialSnake = createInitialSnake(nextCols, nextRows, initialDirection);
    directionQueueRef.current = [];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake, nextCols, nextRows));
    setStatus('idle');
    setAnnouncement('Snake ready. Press space, click, or tap to start.');
  }, []);

  const startGame = useCallback(() => {
    setStatus('running');
    setAnnouncement('Game started.');
    boardRef.current?.focus();
  }, []);

  const endGame = useCallback(() => {
    setStatus('gameOver');
    setAnnouncement('Game over. Press space, click, or tap to play again.');
  }, []);

  const queueDirection = useCallback((nextDirection) => {
    const queue = directionQueueRef.current;
    const plannedDirection = queue[queue.length - 1] ?? directionRef.current;

    if (
      nextDirection === plannedDirection ||
      OPPOSITE[nextDirection] === plannedDirection ||
      queue.length >= 2
    ) {
      return;
    }

    queue.push(nextDirection);
  }, []);

  const measureBoard = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const gridSize = getGridSize();
    const width = shell.getBoundingClientRect().width;
    const { cols: nextCols } = getBoardDimensions(width, gridSize);

    setCols((prevCols) => {
      if (prevCols !== nextCols) {
        resetGame(nextCols, rows);
        return nextCols;
      }
      return prevCols;
    });
  }, [resetGame, rows]);

  useEffect(() => {
    measureBoard();

    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(measureBoard);
    observer.observe(shell);

    return () => observer.disconnect();
  }, [measureBoard]);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');

    const updatePointer = () => {
      setIsCoarsePointer(media.matches);
    };

    updatePointer();
    media.addEventListener('change', updatePointer);

    return () => media.removeEventListener('change', updatePointer);
  }, []);

  useEffect(() => {
    if (status !== 'running') {
      return undefined;
    }

    tickRef.current = window.setInterval(() => {
      const nextDirection = directionQueueRef.current.shift() ?? directionRef.current;
      const direction = DIRECTIONS[nextDirection];
      directionRef.current = nextDirection;

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        if (
          nextHead.x < 0 ||
          nextHead.x >= cols ||
          nextHead.y < 0 ||
          nextHead.y >= rows
        ) {
          endGame();
          return prevSnake;
        }

        const currentFood = foodRef.current;
        const ateFood = currentFood && segmentsEqual(nextHead, currentFood);
        const bodyToCheck = ateFood ? prevSnake : prevSnake.slice(0, -1);

        if (bodyToCheck.some((segment) => segmentsEqual(segment, nextHead))) {
          endGame();
          return prevSnake;
        }

        const nextSnake = [nextHead, ...prevSnake];
        if (!ateFood) {
          nextSnake.pop();
        } else {
          const nextFood = spawnFood(nextSnake, cols, rows);
          if (!nextFood) {
            endGame();
            setAnnouncement('You win! Press space, click, or tap to play again.');
          } else {
            setFood(nextFood);
          }
        }

        return nextSnake;
      });
    }, TICK_MS);

    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
      }
    };
  }, [status, cols, rows, endGame]);

  const handleBoardAction = useCallback(() => {
    if (statusRef.current === 'idle' || statusRef.current === 'gameOver') {
      if (statusRef.current === 'gameOver') {
        directionRef.current = 'RIGHT';
        directionQueueRef.current = [];
        resetGame(cols, rows);
      }
      startGame();
    }
  }, [cols, rows, resetGame, startGame]);

  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key.toLowerCase();

      if (key === ' ' || key === 'spacebar') {
        event.preventDefault();
        handleBoardAction();
        return;
      }

      if (statusRef.current !== 'running') {
        return;
      }

      const directionMap = {
        arrowup: 'UP',
        w: 'UP',
        arrowdown: 'DOWN',
        s: 'DOWN',
        arrowleft: 'LEFT',
        a: 'LEFT',
        arrowright: 'RIGHT',
        d: 'RIGHT',
      };

      const nextDirection = directionMap[key];
      if (nextDirection) {
        event.preventDefault();
        queueDirection(nextDirection);
      }
    },
    [handleBoardAction, queueDirection],
  );

  const handlePointerUp = useCallback(
    (event) => {
      const startX = Number(event.currentTarget.dataset.startX);
      const startY = Number(event.currentTarget.dataset.startY);

      if (!Number.isFinite(startX) || !Number.isFinite(startY)) {
        return;
      }

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
        handleBoardAction();
        return;
      }

      if (statusRef.current !== 'running') {
        return;
      }

      if (absX > absY) {
        queueDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        queueDirection(deltaY > 0 ? 'DOWN' : 'UP');
      }
    },
    [handleBoardAction, queueDirection],
  );

  const setPointerStart = useCallback((event) => {
    event.currentTarget.dataset.startX = String(event.clientX);
    event.currentTarget.dataset.startY = String(event.clientY);
  }, []);

  const showIdleOverlay = status === 'idle';
  const showGameOverOverlay = status === 'gameOver';
  const showTouchControls =
    status === 'idle' || (status === 'running' && isCoarsePointer);

  return (
    <div className={styles.shell} ref={shellRef}>
      <div
        ref={boardRef}
        className={styles.board}
        style={{
          '--snake-cols': cols,
          '--snake-rows': rows,
        }}
        tabIndex={0}
        role="application"
        aria-label="Snake game"
        onKeyDown={handleKeyDown}
        onPointerDown={setPointerStart}
        onPointerUp={handlePointerUp}
      >
        <div
          className={`${styles.playfield}${
            showGameOverOverlay ? ` ${styles.playfieldHidden}` : ''
          }`}
        >
          {snake.map((segment, index) => (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={styles.segment}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1,
              }}
            />
          ))}
          {food ? (
            <div
              className={styles.food}
              style={{
                gridColumn: food.x + 1,
                gridRow: food.y + 1,
              }}
            />
          ) : null}
        </div>

        {showIdleOverlay ? (
          <div className={`${styles.overlay} ${styles.idleOverlay}`} aria-hidden="true">
            <GridText
              as="p"
              variant="dotmatrix-7"
              singleLineFit
              className={`${styles.title} ${styles.idleTitle}`}
            >
              SNAKE
            </GridText>
            <GridText
              as="p"
              variant="geistPixelSquare-1"
              className={`${styles.prompt} ${styles.idlePrompt}`}
            >
              Press space, click or tap to start
            </GridText>
            {showTouchControls ? (
              <DirectionPad onDirection={queueDirection} className={styles.dpadIdle} />
            ) : null}
          </div>
        ) : null}

        {showGameOverOverlay ? (
          <div className={`${styles.overlay} ${styles.gameOverOverlay}`} aria-hidden="true">
            <div className={styles.gameOverTitle}>
              <GridText
                as="p"
                variant="dotmatrix-7"
                singleLineFit
                className={`${styles.title} ${styles.gameOverWord}`}
              >
                GAME
              </GridText>
              <GridText
                as="p"
                variant="dotmatrix-7"
                singleLineFit
                className={`${styles.title} ${styles.gameOverWord}`}
              >
                OVER
              </GridText>
            </div>
            <GridText
              as="p"
              variant="geistPixelSquare-1"
              className={`${styles.prompt} ${styles.gameOverPrompt}`}
            >
              Press space, click or tap to play again
            </GridText>
          </div>
        ) : null}
      </div>

      {status === 'running' && isCoarsePointer ? (
        <DirectionPad onDirection={queueDirection} className={styles.dpadRunning} />
      ) : null}

      <p className={styles.srOnly} aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

function DirectionPad({ onDirection, className = '' }) {
  return (
    <div className={`${styles.dpad} ${className}`.trim()} aria-label="Directional controls">
      <button
        type="button"
        className={`${styles.dpadButton} ${styles.dpadUp}`}
        aria-label="Move up"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onDirection('UP');
        }}
      >
        <span className={styles.dpadArrow} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.dpadButton} ${styles.dpadLeft}`}
        aria-label="Move left"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onDirection('LEFT');
        }}
      >
        <span className={styles.dpadArrow} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.dpadButton} ${styles.dpadRight}`}
        aria-label="Move right"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onDirection('RIGHT');
        }}
      >
        <span className={styles.dpadArrow} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.dpadButton} ${styles.dpadDown}`}
        aria-label="Move down"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onDirection('DOWN');
        }}
      >
        <span className={styles.dpadArrow} aria-hidden="true" />
      </button>
    </div>
  );
}
