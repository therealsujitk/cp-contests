<script lang="ts">
  import { type AccountData } from "$lib/services/account/codeforces";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  import TrendingDownIcon from "@lucide/svelte/icons/trending-down";
  import SquircleIcon from "@lucide/svelte/icons/squircle";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
  import EllispisIcon from "@lucide/svelte/icons/ellipsis";
  import UserIcon from "@lucide/svelte/icons/user";
  import TrashIcon from "@lucide/svelte/icons/trash-2";
  import { LineChart } from "layerchart";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { getAccountData } from '$lib/services/account/codeforces';
  import StatusBadge from "$lib/components/ui/status-badge/status-badge.svelte";
  import ProblemProgress from "$lib/components/ui/problem-progress/problem-progress.svelte";
  import { buttonVariants } from "$lib/components/ui/button";

  let { handle, removeAccount }: { handle: string, removeAccount: () => void } = $props();

  let accountData: AccountData | null = $state(null);
  let contestFilter = $state('Div.');
  let filteredContests = $derived.by(() => accountData?.contests?.filter(c => c.name.includes(contestFilter)) ?? []);
  let problemIndexes = $derived.by(() => {
    const uniqueIndexes = new Set<string>();
    const indexesToMerge = new Set<string>();

    filteredContests.forEach((contest) => {
      contest.problems.forEach((problem) => {
        uniqueIndexes.add(problem.index);
        if (problem.index.endsWith('1')) {
          indexesToMerge.add(problem.index.substring(0, 1));
        }
      });
    });

    for (const index of indexesToMerge) {
      uniqueIndexes.delete(index);
      uniqueIndexes.delete(`${index}1`);
      uniqueIndexes.add(`${index} / ${index}1`);
    }

    return Array.from(uniqueIndexes).sort((a, b) => a.localeCompare(b));
  });
  let indexMapping = $derived.by(() => {
    const mapping: { [index: string]: string } = {};

    for (const index of problemIndexes) {
      index.split(' / ').forEach(i => (mapping[i] = index));
    }

    return mapping;
  });
  let problemStatusFilter = $state([]);
  let problemRatingFilter = $state([]);

  const resetProblemFilters = () => {
    problemStatusFilter = [];
    problemRatingFilter = [];
  };
  
  $effect(() => {
    accountData = null;

    getAccountData(handle)
      .then((data) => {
        accountData = data;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  });

  const filterProblemsByIndex = (problems: AccountData['contests'][0]['problems'], index: string) => {
    const indexes = index.split(' / ').map((i) => i.trim());
    return problems.filter((problem) => indexes.includes(problem.index));
  }

  const getCodeforcesRank = (rating: number) => {
    if (rating < 1200) {
      return 'Newbie';
    } else if (rating < 1400) {
      return 'Pupil';
    } else if (rating < 1600) {
      return 'Specialist';
    } else if (rating < 1900) {
      return 'Expert';
    } else if (rating < 2100) {
      return 'Candidate Master';
    } else if (rating < 2300) {
      return 'Master';
    } else if (rating < 2400) {
      return 'International Master';
    } else if (rating < 2600) {
      return 'Grandmaster';
    } else if (rating < 3000) {
      return 'International Grandmaster';
    } else {
      return 'Legendary Grandmaster';
    }
  }

  const getCodeforcesRankColor = (rating: number) => {
    if (rating < 1200) {
      return 'text-gray-600 dark:text-gray-400';
    } else if (rating < 1400) {
      return 'text-green-600 dark:text-green-400';
    } else if (rating < 1600) {
      return 'text-cyan-600 dark:text-cyan-400';
    } else if (rating < 1900) {
      return 'text-blue-600 dark:text-blue-400';
    } else if (rating < 2100) {
      return 'text-purple-600 dark:text-purple-400';
    } else if (rating < 2400) {
      return 'text-orange-600 dark:text-orange-400';
    } else {
      return 'text-red-600 dark:text-red-400';
    }
  }

  const getCodeforcesRankColorInverted = (rating: number) => {
    if (rating < 1200) {
      return 'text-gray-400 dark:text-gray-600';
    } else if (rating < 1400) {
      return 'text-green-400 dark:text-green-600';
    } else if (rating < 1600) {
      return 'text-cyan-400 dark:text-cyan-600';
    } else if (rating < 1900) {
      return 'text-blue-400 dark:text-blue-600';
    } else if (rating < 2100) {
      return 'text-purple-400 dark:text-purple-600';
    } else if (rating < 2400) {
      return 'text-orange-400 dark:text-orange-600';
    } else {
      return 'text-red-400 dark:text-red-600';
    }
  }

  const getRatingData = () => {
    if (!accountData) return [];

    return accountData.contests.map((contest) => ({
      date: new Date(contest.startTimeSeconds * 1000),
      rating: contest.newRating,
    }));
  }

  const getProblemStatsByRating = () => {
    if (!filteredContests) return {};
    const stats: { [rating: number]: { total: number; solved: number, upsolved: number } } = {};

    filteredContests.forEach((contest) => {
      contest.problems.forEach((problem) => {
        if (!problem.rating) {
          return;
        }

        if (!stats[problem.rating]) {
          stats[problem.rating] = { total: 0, solved: 0, upsolved: 0 };
        }

        if (problem.status === 'SOLVED') {
          stats[problem.rating].solved++;
        } else if (problem.status === 'UPSOLVED') {
          stats[problem.rating].upsolved++;
        }

        stats[problem.rating].total++;
      });
    });

    return stats;
  }

  const getProblemStatsByIndex = () => {
    if (!filteredContests) return {};
    const stats: { [index: string]: { total: number; solved: number, upsolved: number } } = {};

    filteredContests.forEach((contest) => {
      contest.problems.forEach((problem) => {
        if (!stats[indexMapping[problem.index]]) {
          stats[indexMapping[problem.index]] = { total: 0, solved: 0, upsolved: 0 };
        }

        if (problem.status === 'SOLVED') {
          stats[indexMapping[problem.index]].solved++;
        } else if (problem.status === 'UPSOLVED') {
          stats[indexMapping[problem.index]].upsolved++;
        }

        stats[indexMapping[problem.index]].total++;
      });
    });

    return stats;
  }

  const buildContestUrl = (contestId: number) => {
    return `https://codeforces.com/contest/${contestId}`;
  }

  const buildProblemUrl = (contestId: number, index: string) => {
    return `${buildContestUrl(contestId)}/problem/${index}`;
  }
</script>

{#if accountData === null}
  <div class="flex flex-col items-center justify-center mt-20 gap-4">
    <h2 class="text-2xl font-medium flex items-center gap-2"><Spinner class="size-6" /> Loading...</h2>
    <p class="text-center text-muted-foreground max-w-sm">
      Please wait while we fetch your contest history.
    </p>
  </div>
{:else}
  <div class="grid grid-cols-12 gap-4">
    <Card.Root class="col-span-12 bg-secondary/20 border-1 border-dashed ring-0">
      <Card.CardHeader class="flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <Card.CardTitle>Account Overview</Card.CardTitle>
          <Card.CardDescription>View your account at a glance</Card.CardDescription>
        </div>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger {...props} class={[buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer"]}>
                    <EllispisIcon />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Account Options</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-auto" align="end">
            <a target="_blank" href={`https://codeforces.com/profile/${handle}`}>
              <DropdownMenu.Item class="cursor-pointer">
                  <UserIcon /> View Account
              </DropdownMenu.Item>
            </a>
            <DropdownMenu.Item variant="destructive" class="cursor-pointer" onclick={removeAccount}>
              <TrashIcon /> Remove Account
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Card.CardHeader>
    </Card.Root>

    <Card.Root class="col-span-4">
      <Card.CardHeader>
        <Card.CardTitle class={[getCodeforcesRankColor(accountData?.rating ?? 0), "flex gap-1 items-center"]}>
          {getCodeforcesRank(accountData?.rating ?? 0)} • {accountData?.rating}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <CircleAlertIcon size={14} class="text-primary" />
              </Tooltip.Trigger>
              <Tooltip.Content side="right">
                Max Rating - 
                <span class={getCodeforcesRankColorInverted(accountData?.maxRating ?? 0)}>
                  {getCodeforcesRank(accountData?.maxRating ?? 0)} • {accountData?.maxRating}
                </span>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Card.CardTitle>
        <Card.CardDescription>Current Rating</Card.CardDescription>
      </Card.CardHeader>
    </Card.Root>

    <Card.Root class="col-span-4">
      <Card.CardHeader>
        <Card.CardTitle class="flex gap-1 items-center">
          {accountData.contests?.length ?? 0}
          {#if accountData.skippedContests > 0}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <CircleAlertIcon size={14} class="text-red-600 dark:text-red-500" />
                </Tooltip.Trigger>
                <Tooltip.Content side="right">
                  {accountData.skippedContests} Skipped Contest{accountData.skippedContests > 1 ? 's' : ''}
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          {/if}
        </Card.CardTitle>
        <Card.CardDescription>Attended Contests</Card.CardDescription>
      </Card.CardHeader>
    </Card.Root>

    <Card.Root class="col-span-4">
      <Card.CardHeader>
        <Card.CardTitle>
          {Math.round(1e4 * (accountData.acceptedCount / accountData.totalCount)) / 100}%
        </Card.CardTitle>
        <Card.CardDescription>Solve Accuracy</Card.CardDescription>
      </Card.CardHeader>
    </Card.Root>

    <Card.Root class="col-span-12">
      <Card.CardHeader>
        <Card.CardTitle>Ratings Graph</Card.CardTitle>
        <Card.CardDescription>Overview of your rating changes over time</Card.CardDescription>
      </Card.CardHeader>
      <Card.Content>
        <Chart.Container class="h-[250px] w-full ps-4" config={{}}>
          <LineChart data={getRatingData()} x="date" y="rating">
            {#snippet tooltip()}
              <Chart.Tooltip hideLabel >
                {#snippet formatter({ value })}
                  {@const rating = value as number}
                  <div class="flex flex-row w-full justify-between gap-3">
                    <span class="flex gap-1 items-center">
                      <SquircleIcon size={16} class={getCodeforcesRankColor(rating)} fill="currentColor" /> {getCodeforcesRank(rating)}
                    </span>
                    <span>{rating}</span>
                  </div>
                {/snippet}
              </Chart.Tooltip>
            {/snippet}
          </LineChart>
        </Chart.Container>
      </Card.Content>
    </Card.Root>

    <div class="col-span-12">
      <hr />
    </div>

    <Card.Root class="col-span-12 bg-secondary/20 border-1 border-dashed ring-0">
      <Card.CardHeader class="flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <Card.CardTitle>Performance</Card.CardTitle>
          <Card.CardDescription>You can view analysis for a specific division</Card.CardDescription>
        </div>
        
        <Select.Root type="single" name="contest-division" bind:value={contestFilter} onValueChange={() => resetProblemFilters()}>
          <Select.Trigger class="cursor-pointer">
            {#if contestFilter === 'Div.'}
              All Divisions
            {:else}
              {contestFilter.replace('Div. ', 'Division ')}
            {/if}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each ['Div.', 'Div. 1', 'Div. 2', 'Div. 3', 'Div. 4'] as division}
                <Select.Item value={division} class="cursor-pointer">
                  {#if division === 'Div.'}
                    All Divisions
                  {:else}
                    {division.replace('Div. ', 'Division ')}
                  {/if}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Card.CardHeader>
    </Card.Root>

    <Card.Root class="col-span-12">
      <Card.CardHeader>
        <Card.CardTitle>Contest History</Card.CardTitle>
        <Card.CardDescription>Overview of your contest participation</Card.CardDescription>
      </Card.CardHeader>
      <Card.Content>
        <Table.Root class="rounded-lg overflow-hidden">
          <Table.Header>
            <Table.Row>
              <Table.Head>Contest Name</Table.Head>
              {#each problemIndexes as index}
                <Table.Head class="text-center">{index}</Table.Head>
              {/each}
              <Table.Head class="text-center"></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each filteredContests ?? [] as contest}
              <Table.Row>
                <Table.Cell class="w-[275px] block truncate pt-3">
                  <a href={buildContestUrl(contest.id)} target="_blank" class="decoration-[1.5px] hover:underline">{contest.name}</a>
                </Table.Cell>
                {#each problemIndexes as index}
                  <Table.Cell class="text-center">
                    {@const problem = filterProblemsByIndex(contest.problems, index)[0]}
                    <StatusBadge {problem} href={buildProblemUrl(contest.id, problem.index)} />
                  </Table.Cell>
                {/each}
                <Table.Cell>
                  {@const ratingChange = (contest.newRating ?? 0) - (contest.oldRating ?? 0)}
                  {#if ratingChange >= 0}
                    <span class="text-green-500 flex gap-1 items-center">
                      <TrendingUpIcon class="size-3" />
                      {ratingChange}
                    </span>
                  {:else}
                    <span class="text-red-500 flex gap-1 items-center">
                      <TrendingDownIcon class="size-3" />
                      {Math.abs(ratingChange)}
                    </span>
                  {/if}
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row>
                <Table.Cell class="text-center py-6" colspan={2}>
                  No contests found.
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>

    <Card.Root class="col-span-8">
      <Card.CardHeader>
        <Card.CardTitle>Problem Stats (By Rating)</Card.CardTitle>
        <Card.CardDescription>Overview of your problem-solving performance by rating</Card.CardDescription>
      </Card.CardHeader>
      <Card.Content>
        <div class="grid grid-cols-10 gap-2.5">
          {#each Object.entries(getProblemStatsByRating()) as [rating, { total, solved, upsolved }]}
            <div class="text-right font-light">{rating}</div>
            <div class="col-span-4 flex items-center">
              <ProblemProgress {solved} {upsolved} {total} />
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root class="col-span-4">
      <Card.CardHeader>
        <Card.CardTitle>Problem Stats (By Index)</Card.CardTitle>
        <Card.CardDescription>Overview of your problem-solving performance by index</Card.CardDescription>
      </Card.CardHeader>
      <Card.Content>
        <table class="w-full">
          <tbody>
            {#each Object.entries(getProblemStatsByIndex()).toSorted() as [index, { total, solved, upsolved }]}
              <tr>
                <td class="text-right font-light w-4">{index.split(' / ').toReversed()[0]}</td>
                <td class="ps-2.5">
                  <ProblemProgress {solved} {upsolved} {total} />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Card.Content>
    </Card.Root>

    <Card.Root class="col-span-12">
      <Card.CardHeader class="flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <Card.CardTitle>Contest Problems</Card.CardTitle>
          <Card.CardDescription>Overview of problems in your contests</Card.CardDescription>
        </div>

        <div class="flex gap-2">
          <Select.Root type="multiple" name="problem-rating" bind:value={problemRatingFilter}>
            <Select.Trigger class="cursor-pointer">
              Select Rating
            </Select.Trigger>
            <Select.Content class="max-h-[300px]">
              <Select.Group>
                {#each Object.keys(getProblemStatsByRating()) as rating}
                  <Select.Item value={rating} class="cursor-pointer">
                    {rating}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <Select.Root type="multiple" name="problem-status" bind:value={problemStatusFilter}>
            <Select.Trigger class="cursor-pointer">
              Select Status
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item value={'SOLVED'} class="cursor-pointer">
                  Solved
                </Select.Item>
                <Select.Item value={'UPSOLVED'} class="cursor-pointer">
                  Upsolved
                </Select.Item>
                <Select.Item value={'UNSOLVED'} class="cursor-pointer">
                  Unsolved
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </Card.CardHeader>
      <Card.Content>
        <Table.Root class="rounded-lg overflow-hidden">
          <Table.Header>
            <Table.Row>
              <Table.Head>Problem Name</Table.Head>
              <Table.Head>Rating</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each filteredContests as contest}
              {@const problems = contest.problems.toReversed()}
              {@const problemsStatusFiltered = problems.filter(p => problemStatusFilter.length === 0 || problemStatusFilter.find(f => f === p.status))}
              {@const problemsRatingFiltered = problemsStatusFiltered.filter(p => problemRatingFilter.length === 0 || problemRatingFilter.find(f => Number(f) === p.rating))}
              {#each problemsRatingFiltered as problem}
                <Table.Row>
                  <Table.Cell>
                    <a target="_blank" class="decoration-[1.5px] hover:underline" href={buildProblemUrl(contest.id, problem.index)}>
                      {problem.index}. {problem.name}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {problem.rating ?? '-'}
                  </Table.Cell>
                  <Table.Cell class="w-24">
                    <StatusBadge {problem} large />
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  </div>
{/if}
