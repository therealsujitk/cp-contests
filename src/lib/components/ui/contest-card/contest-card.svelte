<script lang="ts">
  import { Card } from "$lib/components/ui/card/index.js";
  import codechef from '$lib/assets/sites/codechef.png';
  import codeforces from '$lib/assets/sites/codeforces.png';
  import leetcode from '$lib/assets/sites/leetcode.png';
  import type { Contest } from "$lib/interfaces";
  import { format } from "date-fns";

  const getHostname = (url: string) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  };

  const getLogo = (hostname: string) => {
    switch (hostname) {
      case 'leetcode.com':
        return leetcode;
      case 'codeforces.com':
        return codeforces;
      case 'codechef.com':
        return codechef;
      default:
        return '';
    }
  };

  const { contest }: { contest: Contest } = $props();
</script>

<a class="block relative rounded-xl overflow-hidden" href={contest.url} target="_blank">
  {#if contest.coverImage}
    <img class="absolute opacity-30" src={contest.coverImage} alt="Background" />
  {/if}
  
  <Card class="relative p-4 flex-row items-center gap-4 group cursor-pointer hover:border-primary/30 transition-all" style={contest.coverImage ? 'background: none' : ''}>
    <img class="w-15 border-1 rounded-md" src={getLogo(getHostname(contest.url))} alt="Logo" />
    <div class="flex-1">
      <span class="group-hover:underline">{contest.title}</span>
      <br />
      <span class="text-sm text-muted-foreground">by <span class="text-primary">{getHostname(contest.url)}</span></span>
    </div>
    <span class="text-lg">{format(contest.startTime, 'h:mm a')}</span>
  </Card>
</a>
