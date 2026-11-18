# Harbour

A polished, original mobile app that explores how a digital government-services
app could work — a central place for simulated registrations, a demo wallet,
fines and demerits, notifications and a profile.

**Harbour is a personal software-engineering project. Everything in it is
fictional and clearly labelled as a demonstration. It is not affiliated with any
government, uses no official branding, logos or photography, and none of its
cards are valid identification.**

Built with Expo (SDK 58), React Native, TypeScript, Expo Router, Reanimated and
Zustand.

## Running it

You need [Node.js](https://nodejs.org) 22+ installed.

```bash
npm install
```

**On your iPhone (recommended):** install **Expo Go** from the App Store, then:

```bash
npx expo start
```

Scan the QR code with your iPhone camera to open the app in Expo Go. It reloads
as you edit.

**In a browser (quick look):**

```bash
npx expo start --web
```

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm test            # jest
npm run check       # all three
```

## How it's organised

```
src/
├── app/              # Expo Router routes only (thin screens)
│   ├── (tabs)/       # Home · Services · Wallet
│   ├── credential/   vehicle/   fine/   category/   # detail screens ([id].tsx)
│   ├── fines, notifications, account, wallet-add, help, gallery
│   └── _layout.tsx   # fonts, theme, root stack
├── components/       # shared components (cards, tab bar, dialog, …)
│   └── ui/           # the design system (Text, Button, Card, ListRow, …)
├── features/home/    # the Home screen and its pieces
├── theme/            # design tokens + ThemeProvider (light/dark)
├── store/            # Zustand stores (app data, preferences) — the repository layer
├── domain/           # pure selectors (statuses, balances, reminders)
├── data/             # fictional seed data + the services catalog
├── types/            # the domain model
└── utils/            # dates, formatting, validation
__tests__/            # Jest tests
docs/                 # DEVLOG.md and the original browser prototype
```

**Architecture in one line:** screens read and change data only through the
store's actions (the repository layer), so the local, on-device data store can
later be swapped for a Supabase backend without changing any screen.

## Roadmap

1. ✅ Project setup and design system
2. ✅ Home and navigation
3. ✅ Digital wallet (add/manage flows, card details)
4. Vehicle management (add vehicle form, validation)
5. Fines and demerits
6. Notifications
7. Profile and settings (editing, app lock)
8. Backend and data persistence (Supabase)
9. Testing, optimisation and security review

See [docs/DEVLOG.md](docs/DEVLOG.md) for what changed in each phase.
