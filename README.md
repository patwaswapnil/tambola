# Tambola Royale

Tambola Royale is a TV-first, offline-capable Tambola caller. It is built for a 16:9 display, but adapts gracefully to desktops and mobile browsers.

## Sprint 1 included

- Permanent high-contrast 1–90 board
- Fair Fisher–Yates sequence generated once per game
- Current number, recent history, and game statistics
- Local persistence after every call
- Resume-or-new-game choice after refresh
- Keyboard/remote-friendly Enter and Space controls, plus fullscreen
- PWA service worker for offline use after installation
- Bundled Indian English female announcements: “Number Four Eight… Forty Eight” and “Single Number Seven”

## Getting started

```bash
npm install
npm run dev
```

For a production verification build:

```bash
npm run build
```

To regenerate the bundled Indian English female voice pack (the build tool is not used at runtime):

```bash
python -m pip install --target scripts/.voice-tools edge-tts
npm run generate:voice
```

## Persistence

The current game is stored under `tambola-royale:game` in `localStorage`. The saved payload contains the game ID, immutable shuffled sequence, current index, calls, current number, voice mode, timestamp, and schema version. Starting a new game removes the previous save and creates a fresh sequence.

## Deliberate Sprint 1 decisions

The lottery-machine visual, animations, bundled voice packs, audio, settings, and developer mode are not rendered yet: these are subsequent roadmap sprints. The game context already stores `voiceMode`, and the pure game engine separates selection from presentation so those additions cannot affect fairness.

GitHub Pages deployments use `/tambola-royale/` as the base path when `GITHUB_ACTIONS` is set. Change this repository slug in `vite.config.ts` if the deployed repository has a different name.

## GitHub Pages

The included [deployment workflow](.github/workflows/deploy.yml) publishes every push to `main` or `master` by pushing the built Vite output to a `gh-pages` branch. In GitHub repository settings, set **Pages** to **Deploy from a branch**, choose the `gh-pages` branch, and use the `/root` folder. The Vite base path is derived from the repository name automatically; set `VITE_BASE_PATH` only when deploying under a custom subpath.
