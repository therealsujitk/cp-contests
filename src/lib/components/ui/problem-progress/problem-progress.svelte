<script lang="ts">
  let { solved, upsolved, total }: { solved: number, upsolved: number, total: number } = $props();
  let totalWidth = $state(0);
</script>

<div class="w-full h-1.5 bg-secondary rounded flex overflow-hidden" bind:clientWidth={totalWidth}>
  <div class="h-full bg-green-500 dark:bg-green-700" style={`width: ${totalWidth * (solved / total)}px`}></div>
  <div class="h-full bg-purple-500 dark:bg-purple-800" style={`width: ${totalWidth * (upsolved / total)}px`}></div>
</div>
