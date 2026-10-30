import {
  DEFAULT_GROUPS,
  configureGroups,
  configureRoutes,
  configureStore,
  installDefaultNormalizers,
  load,
  type GroupDef,
  type StatsSection,
  type SetupRow,
  type Tab,
} from '@greenblacksky/honmoon';

/* What Rumi is made of: the warm-up and range finder are its own
   screens; the singing drills, sessions and stats come from the engine. */

export const APP_ID = 'rumi';
export const APP_NAME = 'Rumi';

export const GROUPS: GroupDef[] = [{ ...DEFAULT_GROUPS.voice, drills: ['singit', 'singdeg'] }];

export const ROUTES = [
  'home',
  'fam',
  'drill',
  'done',
  'stats',
  'setup',
  'warmhome',
  'voice',
  'voicedone',
  'range',
  'met',
];

export const TABS: Tab[] = [
  {
    id: 'navWarm',
    label: 'Warm&nbsp;up',
    to: 'warmhome',
    views: ['warmhome', 'voice', 'voicedone', 'met', 'range'],
  },
  { id: 'navHome', label: 'Practice', to: 'home', views: ['home', 'fam', 'drill', 'done'] },
  { id: 'navStats', label: 'Stats', to: 'stats', views: ['stats'] },
  { id: 'navSet', label: 'Setup', to: 'setup', views: ['setup'] },
];

export const STATS: StatsSection[] = ['overall', 'twoweeks', 'weakest', 'data'];
export const SETUP: SetupRow[] = ['pref', 'appearance', 'hints', 'mdo', 'sound', 'how'];
export const MDO_ADDS =
  'Turning this on adds one drill, Sing the degree: it plays a key, names a degree of it, and you sing that note — found from the key, not from a starting pitch. It is the thing that makes a written line singable without a reference note for every phrase.';

export function setup(): void {
  configureStore({ key: 'honmoon.rumi.v1' });
  configureGroups(GROUPS);
  configureRoutes(ROUTES);
  installDefaultNormalizers();
  load();
}
