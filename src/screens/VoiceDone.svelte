<!-- The voice warm-up summary. -->
<script lang="ts">
  import { Stat, go, minsSecs, streakDays, vstage } from '@greenblacksky/honmoon';
  import { voiceWarmup, vStartRoutine } from '../voice.svelte';
  import VoiceHome from './VoiceHome.svelte';
  const run = $derived(voiceWarmup.current);
</script>

{#if !run}
  <VoiceHome />
{:else}
  <div class="sec">
    <h2>Voice warm-up done</h2>
    <Stat
      items={[
        { v: run.done.length, k: 'Stages' },
        { v: minsSecs(run.secs || 0), k: 'Time' },
        { v: run.done.filter((done) => done.v === 'good').length, k: 'Felt good' },
        { v: streakDays(), k: 'Day streak' },
      ]}
    />
  </div>
  <div class="sec">
    <div class="card stack">
      {#each run.done as done, i (i)}<div class="setrow">
          <span class="lbl">{vstage(done.k).n}</span><span class="tick">{done.v}</span>
        </div>{/each}
    </div>
  </div>
  <div class="sec">
    <div class="bar">
      <button class="ghost" id="voiceagain" onclick={vStartRoutine}>Another warm-up</button>
      <span class="spacer"></span><button class="ghost" id="backwarm" onclick={() => go('warmhome')}
        >Done</button
      >
    </div>
  </div>
{/if}
