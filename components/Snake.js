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
const FOOD_MARGIN = 2;

/**
 * Returns playable column/row counts for the current container width.
 */
function getBoardDimensions(containerWidth, gridSize) {
  const totalCols = Math.floor(containerWidth / gridSize);
  const cols = Math.max(8, totalCols - 2);
  const rows = 22;
  return { cols, rows };
}

function cellKey(x, y) {
  return `${x},${y}`;
}

function getSnakeCells(snake) {
  return new Set(snake.map((segment) => cellKey(segment.x, segment.y)));
}

/**
 * Blocks every snake cell and a Chebyshev margin around it so food cannot spawn on or beside the body.
 */
function getBlockedFoodCells(snake, cols, rows, margin) {
  const blocked = new Set();

  snake.forEach((segment) => {
    const originX = Math.round(Number(segment.x));
    const originY = Math.round(Number(segment.y));

    for (let dy = -margin; dy <= margin; dy += 1) {
      for (let dx = -margin; dx <= margin; dx += 1) {
        const x = originX + dx;
        const y = originY + dy;

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          blocked.add(cellKey(x, y));
        }
      }
    }
  });

  return blocked;
}

function collectOpenCells(cols, rows, blocked) {
  const openCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!blocked.has(cellKey(x, y))) {
        openCells.push({ x, y });
      }
    }
  }

  return openCells;
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
  const snakeCells = getSnakeCells(snake);
  const paddedCells = getBlockedFoodCells(snake, cols, rows, FOOD_MARGIN);
  const openCells = collectOpenCells(cols, rows, paddedCells);
  const candidates = openCells.length > 0
    ? openCells
    : collectOpenCells(cols, rows, snakeCells);

  if (candidates.length === 0) {
    return null;
  }

  const food = candidates[Math.floor(Math.random() * candidates.length)];

  if (snakeCells.has(cellKey(food.x, food.y))) {
    return null;
  }

  return food;
}

/**
 * Places the first food at a fixed cell so server and client HTML match.
 * In-game spawns still use spawnFood (random, never on the snake).
 */
function createInitialFood(snake, cols, rows) {
  const head = snake[0];
  const candidates = [
    { x: Math.floor(cols / 2), y: Math.max(2, head.y - 8) },
    { x: Math.floor(cols / 2), y: 4 },
    { x: Math.max(0, Math.min(cols - 1, head.x)), y: 2 },
  ];
  const snakeCells = getSnakeCells(snake);

  for (const cell of candidates) {
    if (
      cell.x >= 0 &&
      cell.x < cols &&
      cell.y >= 0 &&
      cell.y < rows &&
      !snakeCells.has(cellKey(cell.x, cell.y))
    ) {
      return cell;
    }
  }

  const openCells = collectOpenCells(cols, rows, snakeCells);
  return openCells[0] ?? null;
}

function createGameState(cols, rows, direction = 'RIGHT') {
  const snake = createInitialSnake(cols, rows, direction);
  return {
    snake,
    food: createInitialFood(snake, cols, rows),
  };
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

  const [status, setStatus] = useState('idle');
  const [cols, setCols] = useState(44);
  const [rows] = useState(22);
  const [game, setGame] = useState(() => createGameState(44, 22));
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const gameRef = useRef(game);
  const colsRef = useRef(cols);
  const { snake, food } = game;
  const snakeCells = getSnakeCells(snake);
  const visibleFood = food && !snakeCells.has(cellKey(food.x, food.y)) ? food : null;

  colsRef.current = cols;

  statusRef.current = status;

  const updateGame = useCallback((nextGame) => {
    gameRef.current = nextGame;
    setGame(nextGame);
  }, []);

  const resetGame = useCallback((nextCols, nextRows) => {
    const initialDirection = directionRef.current || 'RIGHT';
    directionQueueRef.current = [];
    updateGame(createGameState(nextCols, nextRows, initialDirection));
    setStatus('idle');
    setAnnouncement('Snake ready. Press space, click, or tap to start.');
  }, [updateGame]);

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

    if (colsRef.current !== nextCols) {
      colsRef.current = nextCols;
      setCols(nextCols);
      resetGame(nextCols, rows);
    }
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

      const {
        snake: prevSnake,
        food: currentFood,
      } = gameRef.current;
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
        return;
      }

      const ateFood = currentFood && segmentsEqual(nextHead, currentFood);
      const bodyToCheck = ateFood ? prevSnake : prevSnake.slice(0, -1);

      if (bodyToCheck.some((segment) => segmentsEqual(segment, nextHead))) {
        endGame();
        return;
      }

      const nextSnake = [nextHead, ...prevSnake];
      let nextFood = currentFood;

      if (!ateFood) {
        nextSnake.pop();
      } else {
        nextFood = spawnFood(nextSnake, cols, rows);

        if (!nextFood) {
          const boardFull = getSnakeCells(nextSnake).size >= cols * rows;
          if (boardFull) {
            endGame();
            setAnnouncement('You win! Press space, click, or tap to play again.');
          }
        }
      }

      updateGame({
        snake: nextSnake,
        food: nextFood,
      });
    }, TICK_MS);

    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
      }
    };
  }, [status, cols, rows, endGame, updateGame]);

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
              key={`segment-${index}`}
              className={styles.segment}
              style={{
                '--cell-x': segment.x,
                '--cell-y': segment.y,
              }}
            />
          ))}
          {visibleFood ? (
            <div
              className={styles.food}
              style={{
                '--cell-x': visibleFood.x,
                '--cell-y': visibleFood.y,
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
