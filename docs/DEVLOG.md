# Harbour — development log

A running record of decisions and what was built in each phase. Newest first.

## Phase 3 — Digital wallet

**Built**
- **`BottomSheet`** — a reusable sheet that slides up over a tappable scrim and
  animates out before unmounting (Reanimated), with a grab handle, title and
  close button; its content scrolls.
- **Wallet sheets:** the ⋯ menu opens an **options** sheet (Manage favourites ·
  Add a demo card · About demo cards); **Manage favourites** stars/unstars cards
  live; **Add a demo card** adds cards the wallet doesn't hold; **About** explains
  the demo nature of the cards.
- **Deep link:** Home's "Manage favourites" and the favourites "+" tile open the
  wallet with the favourites sheet already up (`?sheet=favourites`).
- Replaced the standalone add-card screen with the Add sheet.

**Decisions**
- **Branding stays original:** at the user's request the palette is a red
  primary with navy (the familiar feel of an Australian government services app),
  but in Harbour's own colours, name and arch logo — no third-party logo, emblem,
  photography or copied screens.

**Problems solved**
- **Unstable store selectors:** the sheet selectors did
  `useAppData((s) => s.credentials.filter(...))`, returning a new array each
  render and looping `useSyncExternalStore`. Fixed by selecting the stable
  `credentials` array and filtering in render. Swept the codebase for the same
  pattern.
- **Metro stale cache:** after deleting a route and changing files, the dev
  server kept serving an old transform; a clean restart (`--clear`) was needed.
  Noted for future route changes.

**Tested**
- `tsc`, `expo lint` and 50 Jest tests pass.
- In the web build at iPhone width: opened the ⋯ sheet, Manage favourites and Add
  flows; starred a card and watched the Favourites count go 2 → 3 and persist.
- The same web-only dev hydration warning as Phase 2 appears when a store-reading
  subtree mounts (including the sheet). It's bounded — React recovers and every
  sheet renders and works — and does not occur in Expo Go on a device. To revisit.

## Phase 2 — Home and navigation

**Built**
- **Navigation shell:** three tabs (Home · Services · Wallet) with a custom
  bottom tab bar, and a root stack that pushes detail screens over the tabs.
- **Home tab:** branded header with a notification bell (unread badge) and a
  profile shortcut; greeting; a Favourites carousel of starred wallet cards; a
  "Needs your attention" list derived from the data; a Featured carousel; a
  reorderable Services shortcut list; and a Help entry.
- **Services tab:** a searchable directory of category cards with generated
  header art, each opening a category page of items that either deep-link into
  the app or read as clearly-labelled placeholders.
- **Wallet tab:** All / Favourites filters, the demo card stack, and an Add flow.
- **Detail screens:** credential (with a non-functional demo QR), vehicle
  (renew / remove, its notices), fines dashboard (demerit ring, filters),
  penalty notice (simulated pay), notifications (filters, read/unread, delete),
  and account (profile, appearance, notification preferences, reset demo data).
- **Data layer:** a typed domain model (`src/types`), a repository-style Zustand
  store persisted to AsyncStorage (`src/store/appData.ts`), pure domain
  selectors (`src/domain/selectors.ts`), and the original fictional seed data.

**Decisions**
- **Repository pattern:** screens read and mutate through the store's actions,
  never storage directly. The local store can be swapped for a Supabase-backed
  one with the same action names in Phase 8 without touching any screen.
- **Red/navy palette:** at the user's request the brand palette moved to a red
  primary with a navy ink — the familiar look of an Australian government
  services app, in Harbour's **own** original colours. All colour pairs still
  pass WCAG AA (checked by the theme tests). Branding stays original: Harbour's
  own name and arch logo; no third-party logo, emblem or photography is used.
- **Custom tab bar:** a hand-built bar (rather than the OS default) so the look
  is identical on iOS, Android and web.

**Problems solved**
- **`react-native-svg` on web:** the Phase 1 `SvgXml` approach leaked native-only
  props to the DOM. Rewrote `Icon` to parse its markup once into real
  `<Path>/<Circle>/<Rect>` elements, which render identically on every platform.
- **Zustand snapshot loop:** a selector returning a fresh object each render made
  `useSyncExternalStore` loop. Fixed with a `useShallow`-wrapped
  `useAppDataSnapshot()` hook so subscribers re-render only on real changes.
- **Web output:** switched `web.output` to `single` (SPA) so the web preview
  doesn't server-render; the app targets native (Expo Go), where this is moot.
- **Typed routes:** disabled `typedRoutes` so route strings type-check without a
  running Metro to generate the route manifest.

**Tested**
- `tsc`, `expo lint` and 50 Jest tests all pass.
- Ran the web build and clicked/visited every screen (Home, Services, both
  carousels, Wallet, credential, vehicle, fines, notice, notifications,
  account) in dark mode at iPhone width — all render and navigate.
- Known, non-blocking: a dev-only React hydration warning appears in the **web**
  console at first load (a one-shot, not a live loop; the app stays fully
  interactive). It does not occur in Expo Go on a device. To revisit.
- Not yet tested on a physical iPhone — that needs Expo Go (see README).

## Phase 1 — Project setup and design system

**Built**
- Scaffolded an Expo SDK 58 app (React Native 0.88, React 19.3, TypeScript 6)
  with Expo Router, Reanimated and Gesture Handler.
- A typed design-token system (`src/theme`): spacing, radii, a type scale on
  Plus Jakarta Sans, motion, elevation, and light/dark colour palettes behind a
  `ThemeProvider` that follows the device or an explicit choice.
- 17 reusable UI components (Text, Button, Card, Pill, Glyph, ListRow/Group,
  TextField, Toggle, Chip, SegmentedControl, Skeleton, Empty/Error/Banner
  states, Screen/Header layout, Icon, Logo) plus a component gallery screen.
- Jest + React Native Testing Library set up with 50 tests (theme contrast,
  validation, the preferences store, and component behaviour/accessibility).

**Decisions**
- **Typed tokens over NativeWind:** NativeWind v5 was an unstable release
  candidate; a token system gives strict, themeable styling with no compile step.
- **Own icon set:** SVG path icons, so there's no third-party icon dependency to
  keep compatible with each React Native release.

**Problems solved**
- React Native 0.88 ref typing for `TextInput`; the testing library's
  accessibility matcher names; Reanimated 4 under Jest (a small local mock,
  since the packaged mock initialises a native module that throws in tests).
