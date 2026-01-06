<script lang="ts">
  import { Card } from "$lib/components/ui/card/index.js";
  import codechef from '$lib/assets/sites/codechef.png';
  import codeforces from '$lib/assets/sites/codeforces.png';
  import leetcode from '$lib/assets/sites/leetcode.png';
  import type { Contest } from "$lib/interfaces";
  import { format } from "date-fns";
  import { Button } from "$lib/components/ui/button";
  import CalendarPlus from '@lucide/svelte/icons/calendar-plus';
  import CalendarDays from '@lucide/svelte/icons/calendar-days';
  import googleCalendar from '$lib/assets/icons/google-calendar.png';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { addToGoogleCalendar, downloadICSFile } from "$lib/services/calendar";

  const { contest }: { contest: Contest } = $props();

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
</script>

<div class="block relative rounded-xl overflow-hidden">
  {#if contest.coverImage}
    <img class="absolute opacity-30" src={contest.coverImage} alt="Background" />
  {/if}
  
  <Card class="relative p-4 flex-row items-center gap-4 hover:border-primary/30 transition-all" style={contest.coverImage ? 'background: none' : ''}>
    <img class="w-15 border-1 rounded-md" src={getLogo(new URL(contest.url).hostname)} alt="Logo" />
    <a class="block flex-1 group cursor-pointer" href={contest.url} target="_blank">
      <span class="group-hover:underline">{contest.title}</span>
      <br />
      <span class="text-sm text-muted-foreground group-hover:underline">by <span class="text-primary">{new URL(contest.url).hostname}</span></span>
    </a>
    <div class="flex items-center gap-2">
      <span class="text-lg">{format(contest.startTime, 'h:mm a')}</span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button class="cursor-pointer" size="icon" variant="ghost" disabled={new Date() > contest.startTime}>
            <CalendarPlus />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
            <DropdownMenu.Item class="cursor-pointer" onclick={() => addToGoogleCalendar(contest)}>
              <img class="w-[16px]" src={googleCalendar} alt="Google Calendar Logo" /> Google Calendar
            </DropdownMenu.Item>
            <DropdownMenu.Item class="cursor-pointer" onclick={() => downloadICSFile(contest)}>
              <CalendarDays /> Other Calendar
            </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </Card>
</div>
