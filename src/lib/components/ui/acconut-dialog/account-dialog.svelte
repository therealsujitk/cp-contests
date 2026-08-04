<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import type { Account } from "$lib/stores/selected-account";

  let { addAccount, open = $bindable() }: { addAccount: (account: Account) => void; open: boolean } = $props();

  let platform: 'codeforces' = $state('codeforces');
  let username: string = $state('');

  const platforms = [
    { value: 'codeforces', label: 'Codeforces' }
  ];

  $effect(() => {
    if (open) {
      platform = 'codeforces';
      username = '';
    }
  });
</script>

<Dialog.Root bind:open>
  <form>
    <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Add Account</Dialog.Title>
      <Dialog.Description>
        Add your competitive programming account to view your contest history and performance analysis.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4">
      <div class="grid gap-3">
      <Select.Root type="single" name="platform" bind:value={platform}>
        <Select.Trigger class="w-full">
          {platforms.find(p => p.value === platform)!.label}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            {#each platforms as platformOption}
              <Select.Item value={platformOption.value}>
                {platformOption.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      </div>
      <div class="grid gap-3">
      <Input id="username" name="username" placeholder="Username" bind:value={username} />
      </div>
    </div>
    <Dialog.Footer>
      <Dialog.Close
        type="button"
        class={[buttonVariants({ variant: "outline" }), "cursor-pointer"]}
      >
        Cancel
      </Dialog.Close>
      <Button
        class="cursor-pointer"
        type="submit"
        disabled={username.trim() === ''}
        onclick={() => {
          addAccount({ platform, handle: username.trim() });
          open = false;
        }}
      >
        Add Account
      </Button>
    </Dialog.Footer>
    </Dialog.Content>
  </form>
</Dialog.Root>
