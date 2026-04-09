<script lang="ts">
  import type { PageData } from "./$types";
  import ContestCard from "$lib/components/ui/contest-card/contest-card.svelte";
  import type { Contest } from "$lib/interfaces";
  import { format, parse } from 'date-fns';
  import { filteredSites } from "$lib/stores/filtered-sites";
  import * as Alert from "$lib/components/ui/alert";
  import CircleX from '@lucide/svelte/icons/circle-x';

  let { data }: { data: PageData } = $props();
  let contests = $derived.by(() => {
    const contests = data.contests.filter(c => $filteredSites[new URL(c.url).hostname.split('.')[0]]);
    const contestMap = new Map<string, Contest[]>();

    for (const contest of contests) {
      const dateString = contest.startTime.toLocaleDateString('en-IN');
      if (!contestMap.has(dateString)) contestMap.set(dateString, []);
      contestMap.get(dateString)!.push(contest);
    }

    return contestMap;
  });
  
</script>

<div class="pt-4 pb-5">
  {#each contests.keys() as dateString (dateString)}
    <div class="mb-6">
      <span>{format(parse(dateString, 'dd/MM/yyyy', new Date()), 'eeee, do MMMM yyyy')}</span>
      <div>
        {#each contests.get(dateString) as contest (contest.url)}
          <div class="mt-3">
            <ContestCard contest={contest} />
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center mt-20 gap-4">
      <h2 class="text-2xl font-medium">No Contests Found</h2>
      <p class="text-center text-muted-foreground max-w-sm">
        There are no upcoming contests from the selected platforms.
      </p>
    </div>
  {/each}
</div>

{#if data.errors.length > 0}
  <div class="fixed left-0 bottom-0 p-5 flex flex-col gap-3 max-w-[450px] xs:w-full">
    {#each data.errors as error}
      <Alert.Root variant="destructive">
        <CircleX />
        <Alert.Title>{error.title}</Alert.Title>
        <Alert.Description>
          {error.message}
        </Alert.Description>
      </Alert.Root>
    {/each}
  </div>
{/if}
