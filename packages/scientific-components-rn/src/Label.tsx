import * as React from 'react';
import { Text, type TextProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';

export interface LabelProps extends TextProps {
  /** Label content */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Label
 *
 * Form label text, ported from the web `Label` (a styled Radix
 * `@radix-ui/react-label` root). The web variant layered
 * `peer-disabled:*` classes on top of `textVariants.label.default()`; those
 * CSS peer selectors have no RN equivalent, so only the base label typography
 * is carried over.
 */
export const Label = React.forwardRef<Text, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(textVariants.label.default(), className)}
      accessibilityRole='text'
      {...props}
    >
      {children}
    </Text>
  )
);

Label.displayName = 'Label';
