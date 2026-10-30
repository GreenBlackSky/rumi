# Rumi

The singing app: a guided voice warm-up that walks patterns through your own range, a range finder, and the two singing drills (sing the interval, sing the degree).

Built on Honmoon, the engine (its own repo, `honmoon`). Both live in `apps/huntrix/`, and the
`apps` workspace installs them together (see `apps/README.md`).

## Running it

You need Node.js (the LTS installer from nodejs.org). Install once in the
`apps` folder (`npm install` there), then in this folder:

```
npm run dev        a local server with instant reload — changes to the
                   engine in ../honmoon reload it too
```

`npm run dev` prints two addresses. `localhost` works on this computer. The
`Network` one works on your phone too, if it is on the same Wi-Fi — handy
for trying things on the real screen. (The microphone only works over
`localhost` or https, so test play-along grading on the computer, or after
deploying.)

## Checking it

```
npm run check      TypeScript and Svelte type checking
npm run lint       code problems (ESLint); lint:fix repairs what it can
npm run format     tidy the layout of every file (Prettier)
npm test           builds the app and drives every screen and drill in a
                   headless phone-sized browser (first time: npx playwright install chromium)
```

## Building and deploying

`npm run build` writes `dist/` — plain files, the whole app. Uploading that
folder anywhere that serves https makes it installable on Android: open the
address in Chrome, then *Add to Home screen*. It then runs full-screen and
works offline. With Firebase Hosting, once the project exists:

```
npm install -g firebase-tools
firebase login
firebase init hosting      public directory: dist, single-page app: yes
npm run build && firebase deploy
```

## What's where

```
src/
  main.ts            starts the app
  theme.css          this app's accent colour (the rest of the palette
                     comes from the engine)
  app.ts             what this app contains: its families, screens, tabs,
                     which Stats and Setup sections it shows
  App.svelte         the header and one screen at a time
  voice.svelte.ts    the warm-up runner and the range finder
  screens/           Warm up, the routine, its summary, the range finder
public/              icons for the home screen
tests/               end-to-end tests
```
