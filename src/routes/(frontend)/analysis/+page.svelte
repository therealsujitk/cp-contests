<script lang="ts">
  import { selectedAccount, removeAccount } from "$lib/stores/accounts";
  import CodeforcesAnalysis from "./codeforces-analysis.svelte";

</script>

<svelte:head>
  <title>CP Contests - Analysis</title>
</svelte:head>

<div class="pt-6 pb-12">
  {#if $selectedAccount === null}
    <div class="flex flex-col items-center justify-center mt-20 gap-4">
      <h2 class="text-2xl font-medium">No Account Selected</h2>
      <p class="text-center text-muted-foreground max-w-sm">
        Please select an account to view its contest history.
      </p>
    </div>
  {:else if $selectedAccount.platform === 'codeforces'}
    <CodeforcesAnalysis handle={$selectedAccount.handle} removeAccount={() => removeAccount($selectedAccount)} />
  {/if}
</div>
