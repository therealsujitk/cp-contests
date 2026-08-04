<script lang="ts">
  import ContestCard from "$lib/components/ui/contest-card/contest-card.svelte";
  import type { ContestMetadata } from "$lib/interfaces";
  import { format, parse } from 'date-fns';
  import { filteredSites } from "$lib/stores/filtered-sites";
  import * as Alert from "$lib/components/ui/alert";
  import CircleX from '@lucide/svelte/icons/circle-x';
  import { onMount } from "svelte";
  import { Spinner } from "$lib/components/ui/spinner";

  let errors: { title: string; message: string }[] = $state([]);
  let contests: ContestMetadata[] | null = $state(null);
  let contestsMap = $derived.by(() => {
    if (!contests) {
      return null;
    }

    const filteredContests = contests.filter(c => $filteredSites[new URL(c.url).hostname.split('.')[0]]);
    const contestMap = new Map<string, ContestMetadata[]>();

    for (const contest of filteredContests) {
      const dateString = contest.startTime.toLocaleDateString('en-IN');
      if (!contestMap.has(dateString)) contestMap.set(dateString, []);
      contestMap.get(dateString)!.push(contest);
    }

    return contestMap;
  });

  onMount(() => {
    fetch('/api/upcoming')
      .then(res => res.json())
      .then(data => {
        contests = data.contests;
        errors = data.errors;

        contests?.forEach(contest => {
          contest.startTime = new Date(contest.startTime);
          contest.endTime = new Date(contest.endTime);
        });
      })
      .catch(e => {
        console.error(e);
        errors = [{
          title: 'Oops! Something went wrong.',
          message: 'Please try again later, or report this issue if it persists.'
        }];
      });
  });
</script>

<svelte:head>
  <title>CP Contests - Tracker</title>
</svelte:head>

<div class="pt-6 pb-5">
  {#if !contestsMap}
    <div class="flex flex-col items-center justify-center mt-20 gap-4">
      <h2 class="text-2xl font-medium flex items-center gap-2"><Spinner class="size-6" /> Loading...</h2>
      <p class="text-center text-muted-foreground max-w-sm">
        Please wait while we fetch upcoming contests.
      </p>
    </div>
  {:else}
    {#each contestsMap.keys() as dateString (dateString)}
      <div class="mb-6">
        <span>{format(parse(dateString, 'dd/MM/yyyy', new Date()), 'eeee, do MMMM yyyy')}</span>
        <div>
          {#each contestsMap.get(dateString) as contest (contest.url)}
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
  {/if}
</div>

{#if errors.length > 0}
  <div class="fixed left-0 bottom-0 p-5 flex flex-col gap-3 max-w-[450px] xs:w-full">
    {#each errors as error}
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
