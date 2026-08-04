<script lang="ts">
  import atcoder from '$lib/assets/sites/atcoder.png';
  import codechef from '$lib/assets/sites/codechef.png';
  import codeforces from '$lib/assets/sites/codeforces.png';
  import leetcode from '$lib/assets/sites/leetcode.png';
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { filteredSites } from '$lib/stores/filtered-sites';
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  const trackedSites = [
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
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger {...props} class={[buttonVariants({ variant: "ghost", size: "sm" }), "cursor-pointer px-[8px] py-[22px] flex -space-x-5"]}>
            {#each trackedSites.filter(site => $filteredSites[site.name.toLowerCase()]) as site}
              <Avatar.Root>
                <Avatar.Image class="border-1 border-gray rounded-full" src={site.logo} alt={site.name} />
              </Avatar.Root>
            {:else}
              <span class="text-red-600">No Platforms Selected</span>
            {/each}
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Select Platforms</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="start" class="w-40">
    <DropdownMenu.Group>
      {#each trackedSites as site}
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
