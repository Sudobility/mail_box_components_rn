// Jest mock for @sudobility/components-rn.
//
// The real package resolves to its `src` entry (its `react-native` field),
// which pulls the whole native UI stack (nativewind, react-native-svg, ...)
// into the test environment. These components only use `cn` and `pressProps`,
// so we mock those faithfully (mirroring src/lib/utils.ts and src/lib/a11y.ts).

function cn(...inputs) {
  const out = [];
  const walk = value => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(key => {
        if (value[key]) out.push(key);
      });
    } else {
      out.push(String(value));
    }
  };
  inputs.forEach(walk);
  return out.join(' ');
}

function accessibilityTap(onPress, disabled) {
  if (!onPress || disabled) return undefined;
  return () => onPress(undefined);
}

function pressProps(onPress, disabled) {
  return {
    onPress: onPress ?? undefined,
    onAccessibilityTap: accessibilityTap(onPress, disabled),
  };
}

module.exports = { cn, pressProps, accessibilityTap };
