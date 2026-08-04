<script lang="ts">
  import type { Problem } from "$lib/interfaces/problem";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import CircleCheckBigIcon from "@lucide/svelte/icons/circle-check-big";
  import CircleMinusIcon from "@lucide/svelte/icons/circle-minus";
  import CircleDashedIcon from "@lucide/svelte/icons/circle-dashed";

  let { problem, href, large = false }: { problem: Problem, href?: string, large?: boolean } = $props();
</script>

{#if problem === undefined}
  <Badge variant="secondary" class="size-7 bg-gray-100 dark:bg-gray-950">
    <CircleMinusIcon class="scale-[1.7]" />
  </Badge>
{:else if problem.status === 'SOLVED'}
  <Badge href={href} target="_blank" variant="secondary" class={["bg-green-100 dark:bg-green-950", large ? "h-7" : "size-7"]}>
    <CircleCheckBigIcon class={[large ? "scale-[1.4] me-1" : "scale-[1.7]"]} />{#if large} Solved{/if}
  </Badge>
{:else if problem.status === 'UPSOLVED'}
  <Badge href={href} target="_blank" variant="secondary" class={["bg-purple-100 dark:bg-purple-950", large ? "h-7" : "size-7"]}>
    <CircleCheckBigIcon class={[large ? "scale-[1.4] me-1" : "scale-[1.7]"]} />{#if large} Upsolved{/if}
  </Badge>
{:else}
  <Badge href={href} target="_blank" variant="secondary" class={["bg-red-100 dark:bg-red-950", large ? "h-7" : "size-7"]}>
    <CircleDashedIcon class={[large ? "scale-[1.4] me-1" : "scale-[1.7]"]} />{#if large} Unsolved{/if}
  </Badge>
{/if}
