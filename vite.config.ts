import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';
import dts from 'vite-plugin-dts';

// Each folded-in module (src/<name>/index.ts) is its own build entry, exposed
// via a subpath export (e.g. `@sudobility/components-rn/subscription`).
// Internal dirs (lib, ui, __tests__) are part of the root `index` entry.
const moduleEntries = Object.fromEntries(
  readdirSync(resolve(__dirname, 'src'), { withFileTypes: true })
    .filter(
      d =>
        d.isDirectory() &&
        !['lib', 'ui', '__tests__'].includes(d.name) &&
        existsSync(resolve(__dirname, 'src', d.name, 'index.ts'))
    )
    .map(d => [d.name, resolve(__dirname, 'src', d.name, 'index.ts')])
);

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  // Route JSX through NativeWind's runtime so `className` props on the compiled
  // components are processed by react-native-css-interop in consuming RN apps.
  // Without this the bundle uses React's standard jsx-runtime and className is
  // inert (components render unstyled).
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'nativewind',
  },
  build: {
    lib: {
      // Multi-entry: the root plus each folded-in module, exposed via subpath
      // exports (e.g. `@sudobility/components-rn/subscription`).
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...moduleEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        // jsx runtimes must stay external so the consumer's NativeWind handles them
        /^react\/jsx-(dev-)?runtime$/,
        /^nativewind(\/.*)?$/,
        /^react-native-css-interop(\/.*)?$/,
        'react-native',
        '@react-native-community/slider',
        '@react-native-segmented-control/segmented-control',
        /^@react-navigation\/.*/,
        'react-native-screens',
        'react-native-gesture-handler',
        'react-native-reanimated',
        'react-native-safe-area-context',
        'react-native-svg',
        'react-native-vision-camera',
        'react-native-worklets',
        '@sudobility/design',
        '@sudobility/types',
        'clsx',
        'class-variance-authority',
        // Third-party deps pulled in by folded-in modules — kept external so
        // consumers provide them (and so their JSX-in-.js builds aren't parsed).
        /^expo(-|\/|$)/,
        /^@react-native-firebase\//,
      ],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
