import { Children, isValidElement } from 'react';
import { getTypographyVariant } from '@/lib/pretextTypography';
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
  style,
  ...restProps
}) {
  const plainText = flattenChildrenToText(children);
  const { elementRef, height, offsetY, ready } = usePretextMeasurement({
    text: plainText,
    variant,
    whiteSpace,
  });
  const config = getTypographyVariant(variant);
  const display = Component === 'span' ? 'inline-block' : 'block';

  return (
    <Component
      ref={elementRef}
      className={`grid-text grid-text--${variant}${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        display,
        minHeight: ready && height > 0 ? `${height}px` : undefined,
        whiteSpace: whiteSpace ?? config.whiteSpace,
      }}
      {...restProps}
    >
      <span
        className="grid-text__inner"
        style={{ top: ready && offsetY !== 0 ? `${offsetY}px` : undefined }}
      >
        {children}
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
