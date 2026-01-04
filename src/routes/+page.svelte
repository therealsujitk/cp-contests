<script lang="ts">
  import type { PageData } from "./$types";
  import ContestCard from "$lib/components/ui/contest-card/contest-card.svelte";
  import type { Contest } from "$lib/interfaces";
  import { format, parse } from 'date-fns';

  let { data }: { data: PageData } = $props();
  let contests = $derived.by(() => {
    const contests = data.contests;
    const contestMap = new Map<string, Contest[]>();

    for (const contest of contests) {
      const dateString = contest.startTime.toLocaleDateString('en-IN');
      if (!contestMap.has(dateString)) contestMap.set(dateString, []);
      contestMap.get(dateString)!.push(contest);
      console.log(dateString, parse(dateString, 'dd/MM/yyyy', new Date()));
    }

    return contestMap;
  });
  
</script>

<div class="pt-4 pb-5">
  {#each contests.keys() as dateString}
    <div class="mb-6">
      <span>{format(parse(dateString, 'dd/MM/yyyy', new Date()), 'eeee, do MMMM yyyy')}</span>
      <div>
        {#each contests.get(dateString) as contest}
          <div class="mt-3">
            <ContestCard contest={contest} />
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
