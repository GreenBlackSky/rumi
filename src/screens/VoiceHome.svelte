<!-- The voice warm-up: your range, the stages in their fixed order, and a start button. -->
<script lang="ts">
  import {
    VSTAGES,
    go,
    midiName,
    honmoon,
    queueSave,
    toggledIn,
    vRange,
    vstageOn,
  } from '@greenblacksky/honmoon';
  import { vStartRoutine } from '../voice.svelte';

  const range = $derived(vRange());
  const stagesOn = $derived(VSTAGES.filter((stage) => vstageOn(stage.k)));
  function toggleStage(stage: string) {
    const off = toggledIn(honmoon.settings.voff || [], stage);
    if (off.length >= VSTAGES.length) {
      return; // never switch every stage off
    }
    honmoon.settings.voff = off;
    queueSave();
  }
</script>

<div class="sec">
  <div class="card sesscard stack">
    <div>
      <div style="font-family:var(--f-disp);font-size:22px;letter-spacing:.02em">Voice warm-up</div>
      <p class="note" style="margin:4px 0 0">
        {stagesOn.length} stages in order, about ten minutes. The piano plays each pattern and walks it
        up and down your range; you sing it back.
      </p>
    </div>
    <div class="bar">
      <span class="hint">Range</span><span class="tick"
        >{range.set ? midiName(range.lo) + ' – ' + midiName(range.hi) : 'not set yet'}</span
      >
      <span class="spacer"></span><button
        class="ghost"
        class:on={!range.set}
        data-go="range"
        onclick={() => go('range')}>{range.set ? 'Change' : 'Find my range'}</button
      >
    </div>
    <button class="start" id="startvoice" onclick={vStartRoutine}>Start voice warm-up</button>
    {#if !range.set}<p class="note" style="text-align:center;margin:0">
        Using a default range until you set your own.
      </p>{/if}
    {#if !stagesOn.length}<p class="err">Switch at least one stage on.</p>{/if}
  </div>
</div>
<div class="sec">
  <h2>Stages</h2>
  <div class="stack">
    {#each VSTAGES as stage (stage.k)}
      <div class="scrow" class:on={vstageOn(stage.k)}>
        <button
          class="chip sm tog"
          data-vstage={stage.k}
          aria-pressed={vstageOn(stage.k)}
          onclick={() => toggleStage(stage.k)}>{stage.n}</button
        >
        <span class="ivs">{stage.sounds.length} sounds</span>
        <p class="note">{stage.d}</p>
      </div>
    {/each}
  </div>
  <p class="note">
    The order is fixed on purpose. Semi-occluded work first, agility last — a cold voice doing fast
    runs is how people hurt themselves.
  </p>
</div>
<div class="sec">
  <div class="card">
    <p class="note">
      This is a practice tool built on ordinary warm-up pedagogy, not a substitute for a teacher
      listening to you. Without a microphone it cannot hear whether you are in tune — it drives the
      exercise and gives you the reference pitch.
    </p>
  </div>
</div>
