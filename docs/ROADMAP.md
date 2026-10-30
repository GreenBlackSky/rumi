# Rumi (voice) — roadmap

Planned, not built yet. How paths, lessons, videos and drills work in
general is in `../honmoon/docs/ROADMAP.md`.

Rumi gets a **Learn** tab: a path of five stages. Today's warm-up routine,
range finder and singing drills are spread over the stages.

## The path

**1. First steps**
- how the voice works: breath is the power, the vocal folds make the
  sound, the throat and mouth shape it; registers and the break
- posture; breathing low and wide
- vocal health basics: hydration, warming up and cooling down, the signs
  of strain that mean stop (hoarseness lasting more than about two weeks →
  see a doctor)
- drills: hiss test (breath length), holding a steady note, pitch
  matching, the range finder

**2. Foundations**
- onset and release: hard, breathy and balanced starts
- resonance and vowels
- semi-occluded exercises: lip trills, straw phonation, humming
- sirens and glides
- ear: flat, sharp or in tune?

**3. Registers**
- chest voice, head voice, falsetto, mixed voice
- smoothing out the break
- voice types (and the range finder)
- measured: siren smoothness through the break; a controlled swell
  (messa di voce)

**4. Expression**
- legato and staccato; diction
- breathy tone (soft K-pop verses)
- vocal fry as an effect at the start of a phrase
- twang and cry
- straight tone vs vibrato; natural vibrato (measured: speed and width)
- dynamics; microphone technique

**5. Advanced**
- belting, the safe way
- runs and riffs (melisma) — Whitney Houston and Mariah Carey as the
  classic examples; K-pop ad-libs
- harmony singing in thirds
- grit and rasp — marked *learn with a teacher*
- optional: whistle register; singing while moving (the dance-and-sing
  problem)

Each technique lesson: what it is · how it feels · a safe step-by-step
exercise · what to avoid · examples (a synthesized demo where possible, and
a video — chest versus head voice in particular needs real singers).

## Exercises

- **Knowledge** for every lesson
- **Ear** (made by the synth): flat, sharp or in tune? · vibrato or
  straight tone? · scooped or clean start? · breathy or clear?
- **Measured with the mic**:
  - hold a note — pitch steadiness in cents over 5 seconds
  - hiss test — how long and how evenly a breath lasts
  - swells — crescendo and diminuendo under control
  - clean starts — landing on pitch vs sliding up into it
  - sirens — smooth through the break, or a jump
  - vibrato — speed and width

## Voice type

Today the range finder measures your lowest and highest comfortable notes
and shows the span in octaves. It should also suggest a **voice type**.

- **Types offered:** soprano, mezzo-soprano, contralto (alto), countertenor,
  tenor, baritone, bass, plus "not sure yet".
- **The suggestion:** compare your measured range with the usual range of
  each type and pick the closest. Rough ranges:
  - soprano C4–C6
  - mezzo-soprano A3–A5
  - contralto F3–F5
  - tenor C3–C5
  - baritone A2–A4
  - bass E2–E4

  These are guides, not rules. Show the best match and the runner-up
  ("most likely baritone, close to tenor").
- **Better than range alone:** voice type is also about where the voice
  feels most at home (the tessitura) and where it breaks (the passaggio).
  Two optional extra steps sharpen the guess:
  - a siren, with the mic marking where the break happens
  - "which of these feels easiest to sing?" on a few short phrases
- **Honest wording:** say plainly that an app can only estimate, that a
  teacher hearing you is the real test, and that the type can change as the
  voice is trained. Never present a type as a limit.
- **The user decides:** after the suggestion you can choose any type
  yourself, or change it later in Setup, whatever the measurement said.
  Skipping the range finder and just picking a type works too; that type's
  usual range is then used until a range is measured.
- **Saving:** a new setting (e.g. `vtype`), with no type for old saves so
  they still import. Voice type and range belong in the shared Firebase user
  document later, next to the range.
- **Engine side:** the type table and the matching go in
  `honmoon/src/lib/music/voice.ts`, beside `vRange`.

## Exercises fitted to your voice type and your gaps

Exercises and warm-ups should be chosen for you, not the same for everyone.

- **By voice type:**
  - patterns start and turn round inside your range
  - break-smoothing work is centred on your type's usual break (around
    E4–G4 for many men, A4–C5 for many women), or on the break the siren
    test found
  - a lesson's advice and examples match the type (chest/head balance
    differs between a bass and a soprano)
- **By gaps** (what you are weakest at):
  - **range edges:** gentle work at the top and bottom, a semitone beyond
    your comfortable range at most, never pushed
  - **the break:** more sirens and glides if the mic hears a jump
  - **measured weaknesses:**
    - if a held note wobbles in one area, more held notes there
    - if onsets scoop, more onset work
    - if breaths run short, more hiss work
  - **missed knowledge and ear questions:** come back sooner, as cards
    already do
- **How it is picked:** the same spaced-repetition idea as the rest of the
  app. Every measured exercise records a score per note region. The daily
  warm-up keeps its fixed safe order (gentle first), but within each stage
  chooses the patterns and the keys that need work.
- **Health first:** gap work never replaces the gentle start; it is
  short, and any exercise can be skipped. If something hurts, stop.

## A real video for every exercise

Every exercise and every step of the warm-up routines gets a video of a
real person doing it, not only the synth demo:
- lip trills, straws, sirens, onsets, swells, scales and the rest
- for chest versus head voice, mixed voice and belting, a real singer is
  the only useful example

- Embedded as described in the engine roadmap: youtube-nocookie, playing
  only the start–end segment that shows the exercise; offline → an "Open
  in YouTube" link.
- Where possible, two examples: a lower voice and a higher voice, picking
  the one nearer your voice type first.
- A per-app data file maps each exercise or warm-up step to its videos
  (id, start, end, who is singing).
- **Videos are found by searching and approved by hand, never taken
  from memory.** A step without an approved video simply shows none.

## Better control of the warm-up player

Today the player that plays the support tones has Play/Pause, − and + (move
the starting note one semitone and play once), Once, and tempo chips. It
should have more control:

- **Stop:** separate from Pause. Stop ends the walk and goes back to the
  bottom; Pause keeps the current note to continue from.
- **Restart:** start the walk again from the bottom of the range.
- **Higher / lower while it plays:** move the next run up or down without
  stopping.
- **Direction:**
  - up and back down (today's behaviour)
  - up only
  - down only
  - stay on this note: repeat the same key until you move it
- **Limits:** set the top and bottom note of the walk for this exercise,
  inside your range. Example: stop the climb two notes below the top on a
  tired day.
- **Repeats:** play each key 1, 2 or 3 times before moving on.
- **Visible state:** the current note and direction, and how far up the
  range you are, shown on the range bar.
- **Later, optional:** control from headphone buttons or the lock screen
  through the browser's Media Session API, so you can pause or move without
  touching the phone.

## Songs: sing along with your own songs

Built on the engine's Songs feature (`../honmoon/docs/ROADMAP.md`). You add
an audio file from your phone; Rumi separates the vocal and finds its
melody, then keeps the song on the phone, so you can practise with it
offline.

- **Sing along:** with the original vocal, without it, or with it quiet.
- **See the melody:** a scrolling note lane with your own pitch drawn on
  top, and later the melody as sheet music.
- **Play it on the piano:** hear the vocal line alone, slowly, to learn it.
- **Make it fit you:** transpose the song into your range, suggested from
  your voice type. Loop a hard phrase and slow it down without changing the
  pitch.
- **Learn it in pieces:** loop a line, sing it with the vocal, then without.
- **Later:** a score for how closely you followed the melody; turning a
  phrase into a warm-up or a drill.
- **Group songs:** the separated vocal mixes every member's line, the
  harmonies and the ad-libs. The note editor is how you clean it up to the
  line you sing.

## Tool: a keyboard you can always open

A piano keyboard that is available at any time, outside lessons and
drills. Like the metronome, it is a tool rather than a lesson. It can be
reached from the header (next to the metronome chip) and from the Warm up
tab, and it is not tied to the path or to gentle locking.

- **What it is for:** finding your starting note before you sing, checking
  a note you have just sung, giving yourself a reference pitch for an
  interval, and pitching the first note of a song.
- **Playing:** tap a key to hear it on the piano synth; touch and hold to
  sustain it. A **drone** switch keeps the last note sounding so you can
  sing against it, with a stop button always visible.
- **Layout:** about two octaves on screen at phone width, with buttons (or
  a swipe) to move an octave up or down. Your measured vocal range is shaded
  on the keys and its edges are marked; with no range set, the default range
  is shown. Labels in letters or solfège, following the app's settings.
- **Later, optional:** a "what am I singing?" mode that lights the key
  nearest the pitch the microphone hears (the engine's pitch detection), so
  you can see how close you are.
- **How it is built:** a shared screen in Honmoon, made from the existing
  `Keyboard` component (`tap="play"`) and the synth's `holdNote`/`holdStop`.
  Zoey could offer the same screen. It works offline and saves nothing
  except, perhaps, the last octave shown.
- **When:** small and independent of the path work, so it can be built
  first, at any point.

## Placement test

Offered when the path is first opened (optional).

## Code

The readability pass covered `voice.svelte.ts` (exported state is now
`voiceWarmup.current`, `player`, `PHASE_TEXT`, `rangeFinder`) and the
screens. Deep refactors are listed in the engine's roadmap
(`../honmoon/docs/ROADMAP.md`, "Code: deep refactors").

## Google backend

Planned, not started (design in `../honmoon/docs/ROADMAP.md`): this app on
its own Firebase Hosting site as an installable PWA, optional Google
sign-in, and progress synced through Firestore so it follows you between
devices. Without signing in, everything keeps working as now.
