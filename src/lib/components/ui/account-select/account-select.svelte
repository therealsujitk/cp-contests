<script lang="ts">
  import atcoder from '$lib/assets/sites/atcoder.png';
  import codechef from '$lib/assets/sites/codechef.png';
  import codeforces from '$lib/assets/sites/codeforces.png';
  import leetcode from '$lib/assets/sites/leetcode.png';
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { selectedAccount, addAccount, type Account, getAccounts } from '$lib/stores/accounts';
  import AccountDialog from '../acconut-dialog/account-dialog.svelte';

  let isAddAccountDropdownOpen = $state(false);

  const getLogo = (platform: Account['platform']) => {
    switch (platform) {
      case 'codeforces':
        return codeforces;
      case 'codechef':
        return codechef;
      case 'atcoder':
        return atcoder;
      case 'leetcode':
        return leetcode;
    }
  };

  const getPlatform = (platform: Account['platform']) => {
    switch (platform) {
      case 'codeforces':
        return 'Codeforces';
      case 'codechef':
        return 'CodeChef';
      case 'atcoder':
        return 'AtCoder';
      case 'leetcode':
        return 'LeetCode';
    }
  };

  const getAccountValue = (account: Account | null) => {
    if (account === null) return '';
    return `${account.platform}-${account.handle}`;
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger {...props} class={[buttonVariants({ variant: "ghost", size: "sm" }), "cursor-pointer px-[8px] py-[22px] flex -space-x-5"]}>
            {#if $selectedAccount !== null}
              <div class="flex items-center gap-2">
                <Avatar.Root class="size-9">
                  <Avatar.Image class="border-1 border-gray rounded-full" src={getLogo($selectedAccount.platform)} alt={$selectedAccount.platform} />
                </Avatar.Root>
                <div class="flex flex-col items-start">
                  <span>{$selectedAccount.handle}</span>
                  <span class="text-muted-foreground text-xs">{getPlatform($selectedAccount.platform)}</span>
                </div>
              </div>
            {:else}
              <span class="text-red-600">No Account Selected</span>
            {/if}
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Switch Account</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="start" class="w-64">
    <DropdownMenu.Group class="p-1">
      <DropdownMenu.RadioGroup value={getAccountValue($selectedAccount)}>
        {#each getAccounts() as account}
          <DropdownMenu.RadioItem class="cursor-pointer mb-2 py-2" value={getAccountValue(account)} onclick={() => selectedAccount.set(account)}>
            <div class="flex flex-1 items-center gap-2">
              <Avatar.Root class="size-9">
                <Avatar.Image src={getLogo(account.platform)} alt={account.platform} />
              </Avatar.Root>
              <div class="flex flex-col">
                <span>{account.handle}</span>
                <span class="text-muted-foreground text-xs">{getPlatform(account.platform)}</span>
              </div>
            </div>
          </DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
      <DropdownMenu.Item class="py-2 border-1 border-dashed cursor-pointer" onclick={() => (isAddAccountDropdownOpen = true)}>
        <div class="m-auto flex gap-2 items-center">
          <PlusIcon /> Add Account
        </div>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<AccountDialog {addAccount} bind:open={isAddAccountDropdownOpen} />
