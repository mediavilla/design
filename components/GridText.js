import { Children, isValidElement } from 'react';
import { usePretextMeasurement } from '@/lib/usePretextMeasurement';

/**
 * Renders native DOM text while reserving a grid-aligned height computed by Pretext.
 */
export default function GridText({
  as: Component = 'p',
  children,
  className = '',
  variant = 'body-1',
  whiteSpace,
  singleLineFit = false,
  style,
  ...restProps
}) {
  const plainText = flattenChildrenToText(children);
  const containsBreak = childrenContainBreak(children);
  const resolvedWhiteSpace = singleLineFit
    ? 'nowrap'
    : whiteSpace ?? (containsBreak ? 'pre-wrap' : undefined);
  const {
    config,
    cssFont,
    elementRef,
    height,
    offsetY,
    ready,
    characterTrackingX,
  } = usePretextMeasurement({
    text: plainText,
    variant,
    whiteSpace: resolvedWhiteSpace,
    singleLineFit,
  });
  const display = Component === 'span' ? 'inline-block' : 'block';
  const usesTrackedCharacters = Boolean(
    ready && characterTrackingX && typeof children === 'string',
  );

  return (
    <Component
      ref={elementRef}
      className={`grid-text grid-text--${variant}${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        display,
        font: ready ? cssFont : undefined,
        minHeight: ready && height > 0 ? `${height}px` : undefined,
        whiteSpace: resolvedWhiteSpace ?? config.whiteSpace,
        visibility: singleLineFit && !ready ? 'hidden' : undefined,
      }}
      aria-label={usesTrackedCharacters && !restProps['aria-label'] ? plainText : restProps['aria-label']}
      {...restProps}
    >
      <span
        className="grid-text__inner"
        style={{
          display: singleLineFit ? 'inline-block' : undefined,
          whiteSpace: singleLineFit ? 'nowrap' : undefined,
          left: ready && config.inkOffsetX ? `${config.inkOffsetX}px` : undefined,
          top: ready && offsetY !== 0 ? `${offsetY}px` : undefined,
        }}
      >
        {usesTrackedCharacters
          ? renderTrackedCharacters(children, characterTrackingX)
          : children}
      </span>
    </Component>
  );
}

/**
 * Flattens simple React children into a plain string so Pretext measures the same copy shown in DOM.
 */
function flattenChildrenToText(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }

      if (!isValidElement(child)) {
        return '';
      }

      if (child.type === 'br') {
        return '\n';
      }

      return flattenChildrenToText(child.props.children);
    })
    .join('');
}

function childrenContainBreak(children) {
  return Children.toArray(children).some((child) => {
    if (isValidElement(child)) {
      if (child.type === 'br') {
        return true;
      }

      return childrenContainBreak(child.props.children);
    }

    return false;
  });
}

/**
 * Tightens fixed-matrix display glyphs without changing site-wide letter spacing.
 */
function renderTrackedCharacters(text, characterTrackingX) {
  return text.split('').map((character, index) => (
    <span
      aria-hidden="true"
      className="grid-text__tracked-char"
      key={`${character}-${index}`}
      style={{ marginRight: index === text.length - 1 ? undefined : `${characterTrackingX}px` }}
    >
      {character}
    </span>
  ));
}
