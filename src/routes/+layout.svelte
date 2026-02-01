<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  import atcoder from '$lib/assets/sites/atcoder.png';
  import codechef from '$lib/assets/sites/codechef.png';
  import codeforces from '$lib/assets/sites/codeforces.png';
  import leetcode from '$lib/assets/sites/leetcode.png';
  import { Button } from "$lib/components/ui/button/index.js";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { onMount } from 'svelte';
  import AboutSheet from '$lib/components/ui/about-sheet/about-sheet.svelte';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { filteredSites } from '$lib/stores/filtered-sites';

	let { children } = $props();
  let isDarkMode = $state(false);

  const sites = [
    {
      name: 'AtCoder',
      logo: atcoder
    },
    {
      name: 'CodeChef',
      logo: codechef
    },
    {
      name: 'Codeforces',
      logo: codeforces
    },
    {
      name: 'LeetCode',
      logo: leetcode
    }
  ];

  const toggleTheme = () => {
    isDarkMode = document.getElementsByTagName('body')[0].classList.toggle('dark');
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  };

  onMount(() => {
    if (localStorage.getItem('isDarkMode') === 'true') {
      toggleTheme();
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>CP Contests</title>
</svelte:head>

<div class="fixed z-1 w-full bg-background/30 backdrop-blur-sm border-b-1">
  <div class="flex items-center justify-between gap-4 py-4 px-8 mx-auto max-w-200">
    <div class="flex gap-2 items-center">
      <h1 class="text-2xl">CP Contests</h1>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button class="cursor-pointer px-[8px] py-[22px] flex -space-x-5" size="sm" variant="ghost">
            {#each sites.filter(site => $filteredSites[site.name.toLowerCase()]) as site}
              <Avatar.Root>
                <Avatar.Image class="border-1 border-gray rounded-full" src={site.logo} alt={site.name} />
              </Avatar.Root>
            {/each}
            {#if Object.values($filteredSites).filter(Boolean).length === 0}
              <span class="text-red-600">No Sites Selected</span>
            {/if}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <DropdownMenu.Group>
            {#each sites as site}
              <DropdownMenu.CheckboxItem closeOnSelect={false} class="cursor-pointer" bind:checked={$filteredSites[site.name.toLowerCase()]} >
                <Avatar.Root class="size-6">
                  <Avatar.Image src={site.logo} alt={site.name} />
                </Avatar.Root>
                {site.name}
              </DropdownMenu.CheckboxItem>
            {/each}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
    <div class="flex gap-2">
      <Button class="cursor-pointer" size="icon" variant="outline" onclick={toggleTheme}>
        {#if isDarkMode}
          <Sun />
        {:else}
          <Moon />
        {/if}
      </Button>
      <AboutSheet />
    </div>
  </div>
</div>

<div class="mx-auto max-w-200 px-8 pt-18">
  {@render children()}
</div>
