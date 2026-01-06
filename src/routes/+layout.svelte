<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  import { Button } from "$lib/components/ui/button/index.js";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { onMount } from 'svelte';
  import AboutSheet from '$lib/components/ui/about-sheet/about-sheet.svelte';

	let { children } = $props();
  let isDarkMode = $state(false);

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
  <div class="flex items-center justify-between py-4 px-8 mx-auto max-w-200">
    <h1 class="text-2xl">CP Contests</h1>
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
