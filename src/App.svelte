<!-- Rumi: the header with its tabs, and one screen at a time. -->
<script lang="ts">
  import {
    Shell,
    PracticeHome,
    FamilyScreen,
    DrillScreen,
    SessionDone,
    StatsScreen,
    SetupScreen,
    MetronomeScreen,
    nav,
    session,
  } from '@greenblacksky/honmoon';
  import { APP_ID, APP_NAME, MDO_ADDS, SETUP, STATS, TABS } from './app';
  import { APP_MARK } from './mark';
  import VoiceHome from './screens/VoiceHome.svelte';
  import VoiceRun from './screens/VoiceRun.svelte';
  import VoiceDone from './screens/VoiceDone.svelte';
  import RangeFinder from './screens/RangeFinder.svelte';

  const screen = $derived(nav.view.name);
  /* the range finder belongs to whichever tab opened it */
  const tabFor = (view: string) =>
    view === 'range' && nav.view.opt.from === 'fam' ? 'navHome' : null;
</script>

<Shell appName={APP_NAME} icon={APP_MARK} tabs={TABS} {tabFor}>
  {#if screen === 'drill'}<DrillScreen />
  {:else if screen === 'done' && session.current}<SessionDone />
  {:else if screen === 'fam'}<FamilyScreen fam={nav.view.opt.fam} />
  {:else if screen === 'stats'}<StatsScreen sections={STATS} />
  {:else if screen === 'setup'}<SetupScreen
      rows={SETUP}
      how={['repetition']}
      mdoAdds={MDO_ADDS}
      appId={APP_ID}
    />
  {:else if screen === 'warmhome'}<VoiceHome />
  {:else if screen === 'voice'}<VoiceRun />
  {:else if screen === 'voicedone'}<VoiceDone />
  {:else if screen === 'range'}<RangeFinder />
  {:else if screen === 'met'}<MetronomeScreen back={{ label: 'Warm up', to: 'voice' }} />
  {:else}<PracticeHome />
  {/if}
</Shell>
