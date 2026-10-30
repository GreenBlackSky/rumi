# CLAUDE.md — Rumi (voice)

The singing app: a guided vocal warm-up built in the singer's own range, a
range finder, and singing drills (sing a written note, sing a degree).
Violet accent (#B88CFF dark / #6A3CC8 light); the mark is a straight Korean
sword (saingeom) with a tassel. Dev server port 5174, test preview port 4174.

## The workspace (read this first)

Honmoon (the engine) and the three apps built on it, Mira, Rumi and Zoey,
are four separate repos. They are developed side by side in one npm
workspace: a parent folder, not in any repo, whose `package.json` lists
them and holds the one shared install:

```
<workspace>/            not a git repo — the local glue
  package.json          "workspaces": the projects below
  package-lock.json     the ONE lock file
  node_modules/         the ONE shared install
  huntrix/              a plain folder, no package.json
    honmoon/            the engine, @greenblacksky/honmoon
    mira/  rumi/  zoey/
```

- `@greenblacksky/honmoon` is linked to `../honmoon`, and its `package.json` points
  straight at the TypeScript/Svelte source in `src/lib`. There is no build
  or release step between engine and apps: an engine edit shows up in a
  running app at once. Apps depend on it by range (`"^0.4.0"`); a breaking
  engine change means bumping `honmoon`'s version and the ranges together.
- Everything on the phone comes from an app's `dist/` (`npm run build`),
  with the engine compiled in. The workspace only matters for development.
- Install only from the workspace root: `npm install` there. Never run
  `npm install` inside a project (it would create a stray lock file and a
  local `node_modules` that shadows the shared one).
- Every project pins the same tool versions (exact versions in each
  `package.json`). An upgrade is done in all of them at once, then
  everything is tested: `npm test` from the workspace root.
- Each project is its own git repo; the workspace and `huntrix/` are not.
- Outside the workspace (on GitHub, for example) the apps install the
  published package instead: see `honmoon/docs/PUBLISHING.md`.
- Machine-specific and personal notes live in the workspace's own
  CLAUDE.md, outside the repos. Keep this file free of them.

## Environment and tools

- Node 22. Editor settings (`.vscode/`) are git-ignored and machine-specific.
- Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`); shared
  reactive state lives in `.svelte.ts` modules. TypeScript 6, Vite 8,
  `@sveltejs/vite-plugin-svelte` 7, svelte-check 4. Don't upgrade to
  TypeScript 7 (`@sveltejs/package` needs 6).
- Playwright is pinned to 1.56.1; first run needs
  `npx playwright install chromium`.

## Code style

- **Prettier** formats everything (`.prettierrc.json`: 100 columns, single
  quotes; `prettier-plugin-svelte` for `.svelte`). **ESLint** lints
  (`eslint.config.js`: recommended JS, typescript-eslint and Svelte rules,
  plus `curly: all`, `one-var: never`, `prefer-const`, unused names allowed
  only with a leading `_`). The four projects use identical configs — keep
  them in step.
- Before finishing a change: `npm run format`, `npm run lint` (0 errors),
  `npm run check`.
- The code was ported from a dense single-file original. A first
  readability pass is done across the engine and the apps: spelled-out
  local names, named constants instead of magic numbers, small helper
  functions, no nested ternaries. Short names remain where renaming would
  change the saved format or the public API (`Card.s/c/t/k`, Settings keys,
  shape fields like `s`/`f`/`n`, exports like `lvl`, `ivDef`, `FB`) — those
  are listed under "Code: deep refactors" in `honmoon/docs/ROADMAP.md`.
  Write new code in the spelled-out style; keep the order of random calls
  when refactoring (questions are reproducible with a seeded `Math.random`).
- `no-nested-ternary` is a warning; there are none left — don't add any.
- `public/` (icons) is excluded from formatting.

## Project notes

- Target is an Android phone: an installable PWA, later Firebase Hosting.
  Firebase is deliberately not implemented yet — only a stub.
- Names are a light nod to HUNTR/X from *KPop Demon Hunters*: Honmoon (the
  engine), Mira, Rumi, Zoey. Keep it a reference, not merchandise — no
  character art, no logos, no quotes.

## Commands (in this folder; install happens in the workspace root)

```
npm run dev        dev server with live reload (engine edits included)
npm run check      svelte-check
npm run lint       ESLint (lint:fix fixes what it can)
npm run format     Prettier rewrites the layout of every file
npm test           builds, serves on the preview port, runs Playwright
npm run build      dist/ — the finished PWA
```


## Shape of an app

An app is thin: `src/app.ts` says which drill groups, screens (routes),
tabs, Stats and Setup sections it has, and its storage key;
`src/App.svelte` maps routes to screens inside the engine's `Shell`;
`src/theme.css` sets only the accent colour; `src/mark.ts` is the weapon
drawn beside the name in the header (same drawing as `public/icon.svg`).
Anything another app could use belongs in honmoon, not here.

Icons: `public/icon.svg`, `icon-192.png`, `icon-512.png`,
`icon-maskable-512.png` (no rounded corners) are all rendered from the same
drawing — regenerate the PNGs whenever the SVG changes.

Tests: `tests/helpers.ts` taps like a phone and tolerates buttons that
vanish (auto-advance). Wait ~400 ms after a new question before tapping.

App-specific code: `src/voice.svelte.ts` (the warm-up runner and the range
finder), `src/screens/`. Voice data and pitch detection live in the engine
(`music/voice.ts`, `audio/pitch.ts`, `audio/mic.ts`). The mic needs
`localhost` or https — test locally or after deploying.

Vocal health text must stay cautious: stop on pain or strain; persistent
hoarseness (about two weeks) means seeing a doctor. Don't present medical
claims as certain.

## Planned next (see docs/ROADMAP.md for the full plan)

Nothing below is built yet; it depends on the engine's path, lesson and
drill work (honmoon/docs/ROADMAP.md).

- A **Learn** tab with a five-stage path; the warm-up, range finder and
  singing drills are spread over the stages; gentle locking; optional
  placement test.
  1. First steps — how the voice works, posture, breathing, vocal health.
  2. Foundations — onsets, resonance and vowels, semi-occluded exercises
     (lip trills, straws, humming), sirens.
  3. Registers — chest, head, falsetto, mix, smoothing the break, voice types.
  4. Expression — legato/staccato, diction, breathy tone, vocal fry as an
     effect, twang, cry, straight tone vs vibrato, dynamics, mic technique.
  5. Advanced — safe belting, runs and riffs, harmony in thirds, grit
     ("learn with a teacher"), optional whistle register, singing while moving.
- **Voice type:**
  - the range finder suggests a type (soprano … bass, with a runner-up),
    optionally using a siren to find the break
  - the user can always choose or change it; the wording is honest that
    this is an estimate
  - new `vtype` setting; the type table goes in `music/voice.ts`
- **Exercises fitted to you:** chosen by voice type and by gaps (range
  edges, the break, what the mic measures as weak), inside the warm-up's
  fixed safe order. Never pushed more than a semitone past the comfortable
  range.
- **A real video for every exercise and warm-up step:**
  - youtube-nocookie segments, ideally a lower-voice and a higher-voice
    example
  - found by searching and approved by hand, never from memory
- **Better warm-up player controls:**
  - Stop (separate from Pause) and Restart
  - higher/lower while playing
  - direction: up and down, up only, down only, or stay on one key
  - top/bottom limits for the walk, repeats per key
  - later: headphone and lock-screen control (Media Session API)
- **Songs** (engine feature, see honmoon's roadmap):
  - add an audio file on the phone; the vocal is separated and its melody
    found
  - sing with or without the vocal, follow a note lane with your pitch on
    top, hear the line on the piano, loop, slow down, transpose into your
    range
  - files only, never downloaded from YouTube
- A **keyboard tool** you can open at any time, outside lessons and
  drills, from the header and the Warm up tab: tap or hold keys on the piano
  synth, a drone to sing against, your vocal range shaded, about two
  octaves at a time. Built in honmoon from the existing `Keyboard`
  component, so Zoey could use it too. Independent of the path, so it can
  come first.
- Each technique lesson: what it is, how it feels, a safe step-by-step
  exercise, what to avoid, a synth demo where possible and a video (real
  singers are needed for chest vs head voice).
- Exercises: knowledge questions; ear, all synth-made (flat/sharp/in tune,
  vibrato or straight, scooped or clean, breathy or clear); mic-measured
  (held-note stability in cents, hiss breath length, swells, clean onsets,
  siren smoothness through the break, vibrato speed and width).

## Google backend: Firebase (planned, not started)

Not to be implemented until asked. The design is in
`../honmoon/CLAUDE.md` (and the engine's ROADMAP): one Firebase project for
all three apps, one Hosting site per app serving its `dist/` as an
installable PWA, optional Google sign-in (redirect flow in the installed
app), and progress synced to Firestore at `users/{uid}/apps/rumi` with
offline persistence — everything keeps working without signing in.

Rumi's own share: its Hosting site (HTTPS is what makes the microphone work on the phone — the main reason to deploy early), its web config passed to the store, and the shared sign-in card in Setup. The vocal range from the range finder is the first candidate for the shared user document, so other apps can use it.
Deploy config (`firebase.json`, `.firebaserc`) will live in this repo;
`firebase-tools` comes from the workspace (`npx firebase deploy`), not a
global install.

