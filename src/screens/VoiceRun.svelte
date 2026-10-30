<!-- One stage of the voice warm-up: the sound, the pattern, where it starts, and the controls. -->
<script lang="ts">
  import {
    Keyboard,
    go,
    kbBase,
    midiName,
    honmoon,
    noteName,
    pcOf,
    setSetting,
    vRange,
    vSpan,
    vStartRange,
    vstage,
  } from '@greenblacksky/honmoon';
  import {
    PHASE_TEXT,
    player,
    voiceWarmup,
    toggleGap,
    vNextStep,
    vNudge,
    vOnce,
    vQuit,
    vToggle,
  } from '../voice.svelte';
  import RangeBar from './RangeBar.svelte';
  import VoiceHome from './VoiceHome.svelte';

  const run = $derived(voiceWarmup.current);
  const TEMPOS = [60, 76, 92, 112];
</script>

{#if !run}
  <VoiceHome />
{:else}
  {@const step = run.list[run.i]}
  {@const stage = vstage(step.k)}
  {@const range = vRange()}
  <div class="bar">
    <button class="ghost" id="voicequit" onclick={vQuit}>End warm-up</button>
    <span class="tick">{run.i + 1} / {run.list.length}</span><span class="spacer"></span>
    <span class="tick">{stage.n}</span>
  </div>
  <div class="prog"><i style="width:{((100 * run.i) / run.list.length).toFixed(1)}%"></i></div>

  <div class="sec">
    <div class="card stack">
      <div>
        <div style="font-family:var(--f-disp);font-size:24px;letter-spacing:.02em">
          {step.sound.s}
        </div>
        <p class="note" style="margin:4px 0 0">{step.sound.c}</p>
      </div>
      <p class="note" style="color:var(--ink-2)">{stage.d}</p>
    </div>
  </div>

  {#if stage.timed}
    <div class="sec">
      <div class="card stack">
        <p class="note">
          No piano for this one. Use the metronome if you want a count, and take it slowly.
        </p>
        <div class="bar">
          <button class="ghost" data-go="met" onclick={() => go('met')}>Metronome</button><span
            class="spacer"
          ></span>
        </div>
      </div>
    </div>
  {:else if step.pat}
    {@const startRange = vStartRange(step.pat)}
    {@const start = player.root || startRange.lo}
    <div class="sec">
      <div class="card stack">
        <div class="bar">
          <span class="hint">Pattern</span><span class="tick">{step.pat.n}</span>
          <span class="spacer"></span><span class="hint">Starting on</span><span class="tick"
            >{midiName(start)}</span
          >
        </div>
        <RangeBar lo={range.lo} hi={range.hi} cur={start + vSpan(step.pat) / 2} />
        <Keyboard
          lo={kbBase(start)}
          oct={1}
          tap="play"
          h={104}
          cells={[
            {
              midi: start,
              fill: 'var(--accent)',
              label: noteName(pcOf(start), 'en', honmoon.settings.pref),
            },
          ]}
        />
        <p class="note" style="margin:0">
          The lit key is where this run starts. Press any key to hear it — useful for finding the
          note in your own voice before it plays.
        </p>
        <div class="vphase {player.on ? player.phase || 'cue' : 'idle'}" id="vphase">
          {player.on
            ? PHASE_TEXT[player.phase] || PHASE_TEXT.cue
            : 'It sounds your starting note first, so you know where to come in'}
        </div>
        <div class="bar">
          <button
            class={player.on ? 'ghost on' : 'start'}
            id="vtoggle"
            style="width:auto"
            onclick={vToggle}>{player.on ? 'Pause' : 'Play'}</button
          >
          <button class="mbtn" id="vdn" onclick={() => vNudge(-1)}>−</button><button
            class="mbtn"
            id="vup"
            onclick={() => vNudge(1)}>+</button
          >
          <span class="spacer"></span><button class="ghost" id="vonce" onclick={vOnce}>Once</button>
        </div>
        <div class="bar">
          <span class="hint">Tempo</span>
          {#each TEMPOS as tempo (tempo)}<button
              class="chip sm"
              data-set="vtempo"
              data-val={tempo}
              aria-pressed={+(honmoon.settings.vtempo || 76) === tempo}
              onclick={() => setSetting('vtempo', tempo)}>{tempo}</button
            >{/each}
        </div>
        <div class="bar">
          <button class="ghost" class:on={honmoon.settings.vgap} id="vgap" onclick={toggleGap}
            >{honmoon.settings.vgap ? 'Piano, then you' : 'Sing along with it'}</button
          >
        </div>
        <p class="note">
          Every run starts with the note you are starting on, sounded on its own over the chord,
          then a short pause. {honmoon.settings.vgap
            ? 'It plays the pattern, then leaves you the same space to sing it back.'
            : 'It plays and you sing at the same time, with a short breath between keys.'} It walks up
          to the top of your range and back down on its own.
        </p>
      </div>
    </div>
  {/if}
  <div class="sec">
    <div class="keys3">
      <button class="key v-ok" data-vnext="good" onclick={() => vNextStep('good')}>Felt good</button
      >
      <button class="key v-mid" data-vnext="ok" onclick={() => vNextStep('ok')}>Did it</button>
      <button class="key v-no" data-vnext="skip" onclick={() => vNextStep('skip')}>Skip</button>
    </div>
    <p class="note">
      Stop straight away if anything hurts or feels tight. This is a warm-up, not a workout.
    </p>
  </div>
{/if}
