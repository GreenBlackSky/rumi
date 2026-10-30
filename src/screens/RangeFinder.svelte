<!-- Finds your comfortable range: down until it stops being easy, then up the same way. -->
<script lang="ts">
  import { freqOfSounding, go, holdNote, holdStop, midiName, nav, vRange } from '@greenblacksky/honmoon';
  import {
    RANGE_HIGHEST,
    RANGE_LOWEST,
    rangeFinder,
    rfAnswer,
    rfFinishHigh,
    rfReset,
    rfSave,
  } from '../voice.svelte';
  import RangeBar from './RangeBar.svelte';

  const fromFam = nav.view.opt.from === 'fam';
  const saved = $derived(vRange());
  const span = $derived(rangeFinder.phase === 'done' ? rangeFinder.hi! - rangeFinder.lo! : 0);
  function floorText(): string {
    return rangeFinder.lo != null
      ? 'Floor so far ' + midiName(rangeFinder.lo) + '. '
      : 'Keep going down until it stops being easy. ';
  }
  function ceilingText(): string {
    if (rangeFinder.phase !== 'high') {
      return '';
    }
    return rangeFinder.hi != null
      ? 'Ceiling so far ' + midiName(rangeFinder.hi) + '.'
      : 'Now up, the same way.';
  }
  const octaves = $derived(Math.floor(span / 12));
  const semitones = $derived(span % 12);
</script>

<div class="bar">
  <button
    class="ghost"
    id="backwarm"
    onclick={() => (fromFam ? go('fam', { fam: 'voice' }) : go('warmhome'))}
    >← {fromFam ? 'Voice' : 'Warm up'}</button
  ><span class="spacer"></span><span class="tick">Your range</span>
</div>
{#if rangeFinder.phase === 'done'}
  <div class="sec">
    <div class="card sesscard stack">
      <div>
        <div
          style="font-family:var(--f-disp);font-size:14px;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-3)"
        >
          Your comfortable range
        </div>
        <div style="font-family:var(--f-mono);font-size:30px;font-weight:600;margin-top:2px">
          {midiName(rangeFinder.lo!)} – {midiName(rangeFinder.hi!)}
        </div>
      </div>
      <RangeBar
        lo={rangeFinder.lo!}
        hi={rangeFinder.hi!}
        cur={(rangeFinder.lo! + rangeFinder.hi!) / 2}
      />
      <p class="note">
        {span} semitones{octaves
          ? ' — ' +
            octaves +
            ' octave' +
            (octaves === 1 ? '' : 's') +
            (semitones ? ' and ' + semitones + ' semitone' + (semitones === 1 ? '' : 's') : '')
          : ''}. Every warm-up pattern will stay inside this and turn round at the edges.
      </p>
      <div class="bar">
        <button
          class="ghost"
          id="rflower"
          onclick={() => {
            rangeFinder.lo = Math.max(RANGE_LOWEST, rangeFinder.lo! - 1);
            holdNote(rangeFinder.lo);
          }}>− Floor</button
        ><button
          class="ghost"
          id="rfhigher"
          onclick={() => {
            rangeFinder.hi = Math.min(RANGE_HIGHEST, rangeFinder.hi! + 1);
            holdNote(rangeFinder.hi);
          }}>+ Ceiling</button
        >
        <span class="spacer"></span><button
          class="ghost"
          id="rfhearlo"
          onclick={() => holdNote(rangeFinder.lo!)}>♪ Low</button
        ><button class="ghost" id="rfhearhi" onclick={() => holdNote(rangeFinder.hi!)}
          >♪ High</button
        >
      </div>
      <button class="start" id="rfsave" onclick={rfSave}>Save this range</button>
      <div class="bar">
        <button class="ghost" id="rfreset" onclick={rfReset}>Start again</button><span
          class="spacer"
        ></span>
        <span class="tick">Nudge either end if it feels wrong</span>
      </div>
    </div>
  </div>
{:else}
  <div class="sec">
    <div class="card stack">
      <p class="note">
        Every exercise stays inside your comfortable range, so it needs to know where that is. Sing
        the note you hear on any easy vowel. If it takes effort, say so — the point is the
        comfortable range, not the extreme one.
      </p>
      <div class="tuner">
        <span class="nt">{midiName(rangeFinder.probe)}</span><span class="hz"
          >{freqOfSounding(rangeFinder.probe).toFixed(1)} Hz</span
        >
      </div>
      <div class="bar">
        <button
          class="start"
          id="rfplay"
          style="width:auto"
          onclick={() => holdNote(rangeFinder.probe)}>♪ Play and hold it</button
        >
        <button
          class="mbtn"
          id="hushbtn"
          aria-label="Stop the sound"
          title="Stop the sound"
          onclick={holdStop}>■</button
        >
        <span class="spacer"></span><span class="tick"
          >{rangeFinder.phase === 'low' ? 'finding your floor' : 'finding your ceiling'}</span
        >
      </div>
      <div class="keys">
        <button class="key v-ok" data-rf="ok" onclick={() => rfAnswer(true)}>Comfortable</button>
        <button class="key v-no" data-rf="no" onclick={() => rfAnswer(false)}
          >{rangeFinder.phase === 'low' ? 'Too low' : 'Too high'}</button
        >
      </div>
      <p class="note">
        {floorText()}{ceilingText()}
      </p>
      <div class="bar">
        <button class="ghost" id="rfreset" onclick={rfReset}>Start again</button>
        {#if rangeFinder.phase === 'high' && rangeFinder.hi != null}<span class="spacer"
          ></span><button
            class="ghost on"
            data-rf="stop"
            onclick={() => {
              holdStop();
              rfFinishHigh();
            }}>That is my top</button
          >{/if}
      </div>
    </div>
  </div>
{/if}
<div class="sec">
  <div class="card">
    <div class="setrow" style="border:none">
      <span class="lbl">Currently stored</span>
      <span class="tick"
        >{saved.set
          ? midiName(saved.lo) + ' – ' + midiName(saved.hi)
          : 'not set, using ' + midiName(saved.lo) + ' – ' + midiName(saved.hi)}</span
      >
    </div>
  </div>
</div>
