import {
  go,
  holdNote,
  holdStop,
  honmoon,
  nav,
  onNavigate,
  queueSave,
  vBuildRoutine,
  vPlayOnce,
  vStartRange,
  type RoutineStep,
} from '@greenblacksky/honmoon';

/* ---------------- the voice warm-up runner ----------------
   The piano plays each pattern and walks it up and down your range; you sing
   it back. Each run starts with the note you are starting on, sounded on its
   own over the chord, then a short pause. */
export interface VoiceRun {
  /** the stages of the routine, in order */
  list: RoutineStep[];
  /** index of the stage on screen */
  i: number;
  /** when the routine started (ms) */
  t0: number;
  /** each finished stage and how it felt */
  done: { k: string; v: string }[];
  /** length of the whole routine, set when it ends */
  secs?: number;
}
export const voiceWarmup: { current: VoiceRun | null } = $state({ current: null });
type Phase = 'cue' | 'play' | 'sing' | 'rest';
/** The pattern player: whether it is running, what it is doing, and the key it is in. */
export const player = $state({
  on: false,
  phase: 'cue' as Phase,
  /** walking up (1) or down (-1) the range */
  dir: 1,
  /** the starting note of the current run; 0 = not chosen yet */
  root: 0,
});
export const PHASE_TEXT: Record<Phase, string> = {
  cue: 'Listen — this is your starting note',
  play: 'Now it plays the pattern',
  sing: 'Your turn — sing it back',
  rest: 'Breathe',
};

const DEFAULT_TEMPO = 76;
/** With the singing gap off you still get a breath: this share of the pattern's length. */
const SHORT_GAP_SHARE = 0.25;
/** Small margins after a run so the next one does not clip its tail. */
const PHASE_MARGIN_MS = 60;
const NEXT_RUN_MARGIN_MS = 120;
/** Screens that belong to a routine in progress; going anywhere else abandons it. */
const ROUTINE_SCREENS = ['voice', 'voicedone', 'met', 'range'];

const tempo = () => honmoon.settings.vtempo || DEFAULT_TEMPO;
let nextRunTimer: ReturnType<typeof setTimeout> | null = null;
let playPhaseTimer: ReturnType<typeof setTimeout> | null = null;
let singPhaseTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
  for (const timer of [nextRunTimer, playPhaseTimer, singPhaseTimer]) {
    if (timer) {
      clearTimeout(timer);
    }
  }
  nextRunTimer = null;
  playPhaseTimer = null;
  singPhaseTimer = null;
}
/** The stage on screen, if any. */
function currentStep(): RoutineStep | null {
  const run = voiceWarmup.current;
  return run ? run.list[run.i] : null;
}
export function vStartRoutine(): void {
  const list = vBuildRoutine();
  if (!list.length) {
    return;
  }
  voiceWarmup.current = { list, i: 0, t0: Date.now(), done: [] };
  player.root = 0;
  go('voice');
}
export function vStop(): void {
  player.on = false;
  clearTimers();
}
/** The next starting note: one step on in the current direction, turning
    round at either end of the range the pattern fits in. */
function nextRoot(range: { lo: number; hi: number }): number {
  let next = player.root + player.dir;
  if (next > range.hi) {
    player.dir = -1;
    next = player.root - 1;
  } else if (next < range.lo) {
    player.dir = 1;
    next = Math.min(player.root + 1, range.hi);
  }
  return Math.max(range.lo, Math.min(range.hi, next));
}
/** Play one run and schedule the phases and the next run. */
function tick(): void {
  const step = currentStep();
  if (!player.on || !voiceWarmup.current) {
    return;
  }
  if (!step || !step.pat) {
    player.on = false;
    return;
  }
  const pattern = step.pat;
  const timing = vPlayOnce(player.root, pattern, tempo(), true);
  const gap = honmoon.settings.vgap ? timing.pat : timing.pat * SHORT_GAP_SHARE;
  player.phase = 'cue';
  playPhaseTimer = setTimeout(() => {
    if (player.on) {
      player.phase = 'play';
    }
  }, timing.cue * 1000);
  singPhaseTimer = setTimeout(
    () => {
      if (player.on) {
        player.phase = honmoon.settings.vgap ? 'sing' : 'rest';
      }
    },
    timing.total * 1000 + PHASE_MARGIN_MS,
  );
  nextRunTimer = setTimeout(
    () => {
      if (singPhaseTimer) {
        clearTimeout(singPhaseTimer);
      }
      if (!player.on) {
        return;
      }
      /* walk up to the top of the range and back down on its own */
      player.root = nextRoot(vStartRange(pattern));
      tick();
    },
    (timing.total + gap) * 1000 + NEXT_RUN_MARGIN_MS,
  );
}
/** Where a walk starts if the current root does not fit: a little above the bottom. */
const START_ABOVE_LOWEST = 2;
export function vStart(): void {
  const step = currentStep();
  if (!step || !step.pat) {
    return;
  }
  const range = vStartRange(step.pat);
  if (player.root < range.lo || player.root > range.hi) {
    player.root = Math.min(range.hi, range.lo + START_ABOVE_LOWEST);
  }
  player.on = true;
  player.dir = 1;
  player.phase = 'cue';
  tick();
}
export function vToggle(): void {
  if (player.on) {
    vStop();
  } else {
    vStart();
  }
}
/** One run, without starting the walk. */
export function vOnce(): void {
  const step = currentStep();
  if (!step || !step.pat) {
    return;
  }
  if (!player.root) {
    player.root = vStartRange(step.pat).lo;
  }
  vPlayOnce(player.root, step.pat, tempo(), true);
}
/** Nudging the key wants the pattern straight away; the reference cue would
    make every tap of + sit through a second and a half of chord first. */
export function vNudge(direction: 1 | -1): void {
  const step = currentStep();
  if (!step || !step.pat) {
    return;
  }
  const range = vStartRange(step.pat);
  player.root = Math.max(range.lo, Math.min(range.hi, (player.root || range.lo) + direction));
  vPlayOnce(player.root, step.pat, tempo(), false);
}
export function vNextStep(verdict: string): void {
  const run = voiceWarmup.current;
  if (!run) {
    return;
  }
  vStop();
  run.done.push({ k: run.list[run.i].k, v: verdict || 'done' });
  run.i++;
  if (run.i >= run.list.length) {
    run.secs = Math.round((Date.now() - run.t0) / 1000);
    go('voicedone');
    return;
  }
  player.root = 0;
}
export function vQuit(): void {
  vStop();
  voiceWarmup.current = null;
  go('warmhome');
}
export function toggleGap(): void {
  honmoon.settings.vgap = !honmoon.settings.vgap;
  queueSave();
}

/* ---------------- the range finder ----------------
   Hold a note, say whether it was comfortable, and the probe steps down
   (finding your floor) and then up (finding your ceiling). */
/** C3: where the search for your floor starts. */
const FIRST_PROBE = 48;
/** The lowest and highest notes the finder will offer (E1, C6). */
export const RANGE_LOWEST = 28;
export const RANGE_HIGHEST = 84;
/** A range narrower than a fifth is a mistake; it becomes an octave from the floor. */
const MIN_SPAN = 7;
const FALLBACK_SPAN = 12;
/** The ceiling search starts a fifth above the floor, kept between G3 and G5. */
const CEILING_PROBE_MIN = 55;
const CEILING_PROBE_MAX = 79;
/** A floor to assume when none was found (A2). */
const DEFAULT_FLOOR = 45;
const NEXT_PROBE_DELAY_MS = 200;

export const rangeFinder = $state({
  phase: 'low' as 'low' | 'high' | 'done',
  /** the note being offered */
  probe: FIRST_PROBE,
  lo: null as number | null,
  hi: null as number | null,
});
export function rfReset(): void {
  holdStop();
  Object.assign(rangeFinder, { phase: 'low', probe: FIRST_PROBE, lo: null, hi: null });
}
function finishLow(): void {
  if (rangeFinder.lo == null) {
    rangeFinder.lo = rangeFinder.probe;
  }
  rangeFinder.phase = 'high';
  rangeFinder.probe = Math.max(
    Math.min(rangeFinder.lo + MIN_SPAN, CEILING_PROBE_MAX),
    CEILING_PROBE_MIN,
  );
}
export function rfFinishHigh(): void {
  if (rangeFinder.hi == null) {
    rangeFinder.hi = Math.max((rangeFinder.lo || DEFAULT_FLOOR) + MIN_SPAN, rangeFinder.probe - 1);
  }
  if (rangeFinder.hi < rangeFinder.lo! + MIN_SPAN) {
    rangeFinder.hi = rangeFinder.lo! + FALLBACK_SPAN;
  }
  rangeFinder.phase = 'done';
}
/** "Comfortable" moves the probe on; "too low" ends the floor search. */
function answerLow(ok: boolean): void {
  if (!ok) {
    if (rangeFinder.lo == null) {
      rangeFinder.lo = rangeFinder.probe + 1;
    }
    finishLow();
    return;
  }
  rangeFinder.lo = rangeFinder.probe;
  if (rangeFinder.probe <= RANGE_LOWEST) {
    finishLow();
  } else {
    rangeFinder.probe--;
  }
}
/** "Comfortable" moves the probe on; "too high" ends the ceiling search. */
function answerHigh(ok: boolean): void {
  if (!ok) {
    if (rangeFinder.hi == null) {
      rangeFinder.hi = rangeFinder.probe - 1;
    }
    rfFinishHigh();
    return;
  }
  rangeFinder.hi = rangeFinder.probe;
  if (rangeFinder.probe >= RANGE_HIGHEST) {
    rfFinishHigh();
  } else {
    rangeFinder.probe++;
  }
}
export function rfAnswer(ok: boolean): void {
  holdStop();
  if (rangeFinder.phase === 'low') {
    answerLow(ok);
  } else if (rangeFinder.phase === 'high') {
    answerHigh(ok);
  }
  if (rangeFinder.phase !== 'done') {
    setTimeout(() => {
      if (nav.view.name === 'range') {
        holdNote(rangeFinder.probe);
      }
    }, NEXT_PROBE_DELAY_MS);
  }
}
export function rfSave(): void {
  const settings = honmoon.settings;
  if (rangeFinder.lo != null) {
    settings.vlo = rangeFinder.lo;
  }
  if (rangeFinder.hi != null) {
    settings.vhi = rangeFinder.hi;
  }
  if (settings.vlo != null && settings.vhi != null && settings.vhi < settings.vlo + MIN_SPAN) {
    settings.vhi = settings.vlo + FALLBACK_SPAN;
  }
  queueSave();
  go('warmhome');
}

onNavigate((_from, to) => {
  if (voiceWarmup.current && !ROUTINE_SCREENS.includes(to)) {
    voiceWarmup.current = null;
    vStop();
  }
  if (to !== 'voice') {
    player.on = false;
    if (nextRunTimer) {
      clearTimeout(nextRunTimer);
      nextRunTimer = null;
    }
  }
  if (to === 'range') {
    rfReset();
  }
});
