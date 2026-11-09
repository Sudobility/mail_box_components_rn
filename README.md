# @sudobility/components-rn

React Native UI component library providing 90+ core components ported from the web `@sudobility/components` library. Built with TypeScript, Vite (library mode) and NativeWind v4; ships ESM + CJS. Design tokens, colors, typography and variant functions come from `@sudobility/design`; shared types from `@sudobility/types`.

This is a single library (not a monorepo). Core UI is the root export; ~48 domain bundles (email, web3, devops, finance, healthcare, …) are published as **subpath exports** — see [Domain bundles](#domain-bundles).

Repo: `mail_box_components_rn` · package: `@sudobility/components-rn`.

## Installation

This package is published to **GitHub Packages** under the `@sudobility` scope, so consumers need an `.npmrc` that points the scope at the GitHub registry (this repo ships one):

```
@sudobility:registry=https://npm.pkg.github.com
```

Authentication uses a GitHub token with `read:packages` (CI reads it from the `GH_PACKAGES_READ_TOKEN` secret). Then:

```bash
bun add @sudobility/components-rn @sudobility/design @sudobility/types
```

Peer dependencies (see `package.json` for exact ranges): `react` (18/19), `react-native` (>=0.72), `@sudobility/design`, `@sudobility/types`, `nativewind` (>=4), `@react-native-community/slider`, `@react-native-segmented-control/segmented-control`, `@react-navigation/native` + `native-stack` (+ optional `stack`), `react-native-screens`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-svg`, `class-variance-authority`, `clsx`, `tailwind-merge`, and (optional) `expo-clipboard`.

The `Slider` uses the platform-native control on iOS, Android, Windows, and macOS. The macOS `NSSlider` is provided by this package's autolinked CocoaPods view manager; run `pod install` after adding the package to a macOS app.

## Usage

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Input,
  Alert,
  Box,
  Flex,
  Stack,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Avatar,
  Spinner,
  Modal,
  Select,
  Switch,
  variants,
  textVariants,
  designTokens,
} from '@sudobility/components-rn';

export function MyScreen() {
  return (
    <Card variant='elevated'>
      <CardContent>
        <Input placeholder='Enter email' />
        <Button variant='primary' onPress={handleSubmit}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
```

## API

### Core UI (`src/ui/`) -- 90+ components

- **Layout**: Box, Flex, Stack, Grid, Divider, Separator, Container, Center, Spacer, SplitPane, PageContainer, FloatingPanel, Masonry, MasterDetailLayout
- **Form**: Input, TextArea, Checkbox, Switch, Select, SearchInput, NumberInput, PhoneInput, Combobox, DateInput, DateTimePicker, FileInput, MultiSelect, Label, HelperText, FormAlerts
- **Display**: Badge, Avatar, Skeleton, List, DataList, Table, StatDisplay, DashboardStatCard, KeyValuePair, FormattedNumber, IconText, InfoBox
- **Typography**: Text, Heading, Code, CodeDisplay, TruncatedText, Kbd
- **Feedback**: Spinner, Progress, ProgressCircle, Modal, Toast, LoadingOverlay, LoadingDots, Alert, Backdrop
- **Overlay**: Sheet, Dialog, Popover, Tooltip, Overlay, TextInputModal
- **Navigation**: Tabs, Link, Breadcrumb, BreadcrumbNav, Pagination, NavigationList, SettingsList, SideNav, SmartLink, ScrollSpy
- **Features**: FeatureCard, FeatureGrid, CTASection, PromotionalBanner, AnimatedCounter, AnimatedSection

<a id="domain-bundles"></a>

### Domain bundles (subpath exports)

Domain-specific components live under `src/<domain>/` and are published as **subpath exports** of this one package — not as separate npm packages. Import them from `@sudobility/components-rn/<domain>`:

```tsx
import { EmailTemplate } from '@sudobility/components-rn/email';
import { WalletIcon } from '@sudobility/components-rn/web3';
```

~48 domains are exported (each maps to `src/<domain>/index.ts`), including: `agriculture`, `analytics`, `automotive`, `collaboration`, `communication`, `construction`, `design`, `devops`, `documents`, `ecommerce`, `education`, `email`, `energy`, `entertainment`, `entity`, `events`, `finance`, `fitness`, `food`, `gaming`, `government`, `healthcare`, `hr`, `insurance`, `interaction`, `iot`, `legal`, `logistics`, `manufacturing`, `marketing`, `media`, `monitoring`, `nonprofit`, `project-management`, `ratelimit`, `realestate`, `retail`, `scanner`, `scheduling`, `scientific`, `search`, `security`, `social`, `subscription`, `travel`, `visualization`, `web3`, `workflow`. The authoritative list is the `exports` map in `package.json`.

## Development

Always use `bun`.

```bash
bun install
bun run build              # tsc + vite build + scripts/fix-esm-imports.mjs
bun run dev                # vite build --watch
bun run type-check         # tsc --noEmit
bun run lint               # eslint src, --max-warnings 0
bun run format             # prettier --write (also: format:check)
bun run test:unit          # jest (react-native preset, --passWithNoTests)
bun run test:watch         # jest --watch
bun run test:coverage      # jest --coverage
```

Publishing runs `prepublishOnly` (`bun run build`) and is handled by CI (`.github/workflows/ci-cd.yml`, which calls the shared `johnqh/workflows` pipeline and publishes to GitHub Packages).

## Related Packages

- `@sudobility/design` -- design tokens, colors, typography, variants (peer dependency)
- `@sudobility/types` -- shared TypeScript types (peer dependency)
- `@sudobility/components` -- web version of this library

## License

BUSL-1.1
