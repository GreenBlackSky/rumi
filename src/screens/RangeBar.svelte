<!-- A bar from the bottom of a range to the top, with a marker where you are. -->
<script lang="ts">
  import { midiName } from '@greenblacksky/honmoon';
  const { lo, hi, cur }: { lo: number; hi: number; cur: number } = $props();
  const pct = $derived(Math.max(0, Math.min(100, (100 * (cur - lo)) / Math.max(1, hi - lo))));
</script>

<div class="rbar">
  <i style="left:{pct.toFixed(1)}%"></i><span class="rl">{midiName(lo)}</span><span class="rr"
    >{midiName(hi)}</span
  >
</div>
