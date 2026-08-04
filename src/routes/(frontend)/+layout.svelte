<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  import AboutSheet from '$lib/components/ui/about-sheet/about-sheet.svelte';
  import ThemeToggleButton from '$lib/components/ui/theme-toggle/theme-toggle-button.svelte';
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import Button from '$lib/components/ui/button/button.svelte';
  import CalendarRangeIcon from '@lucide/svelte/icons/calendar-range';
  import ChartNoAxesCombinedIcon from '@lucide/svelte/icons/chart-no-axes-combined';
  import { page } from '$app/state';
  import PlatformSelect from '$lib/components/ui/platform-select/platform-select.svelte';
  import { type Component } from 'svelte';
  import AccountSelect from '$lib/components/ui/account-select/account-select.svelte';

	let { children } = $props();

  interface Route {
    name: string;
    icon: Component;
    headerExtra?: Component;
  }

  const routes: Record<string, Route> = {
    '/': {
      name: 'Contest Tracker',
      icon: CalendarRangeIcon,
      headerExtra: PlatformSelect,
    },
    '/analysis': {
      name: 'Contest Analysis',
      icon: ChartNoAxesCombinedIcon,
      headerExtra: AccountSelect,
    }
  };

  const currentRoute = $derived(routes[page.url.pathname] as Route);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="fixed z-1 w-full bg-background/30 backdrop-blur-sm border-b-1">
  <div class="flex items-center justify-between gap-4 py-4 px-8 mx-auto max-w-200">
    <div class="flex gap-2 items-center">
      <h1 class="text-2xl">{currentRoute.name}</h1>
      {#if currentRoute.headerExtra}
        <currentRoute.headerExtra />
      {/if}
    </div>
    <div class="flex gap-2">
      {#each Object.entries(routes) as [href, route]}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant={href === page.url.pathname ? "secondary" : "outline"} size="icon" href={href}>
                <route.icon />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{route.name}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      {/each}
      <ThemeToggleButton />
      <AboutSheet />
    </div>
  </div>
</div>

<div class="mx-auto max-w-200 px-8 pt-18">
  {@render children()}
</div>
