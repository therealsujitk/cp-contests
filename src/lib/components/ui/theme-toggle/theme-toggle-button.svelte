<script lang="ts">
  import { onMount } from 'svelte';
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";

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

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger class={[buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer"]} onclick={toggleTheme}>
      {#if isDarkMode}
        <Sun />
      {:else}
        <Moon />
      {/if}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Switch to {isDarkMode ? "Light Mode" : "Dark Mode"}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
