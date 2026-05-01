<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import Info from '@lucide/svelte/icons/info';
  import HandHeart from '@lucide/svelte/icons/hand-heart';
  import GitHub from '@lucide/svelte/icons/github'
  import ContactRound from '@lucide/svelte/icons/contact-round';

</script>
 
<Sheet.Root>
  <Sheet.Trigger class={[buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer"]}>
    <Info />
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>About CP Contests</Sheet.Title>
    </Sheet.Header>
    <div class="grid flex-1 auto-rows-min gap-6 mt-[-10px] px-4">
      <span>Hi, I'm <b>@therealsujitk</b> 👋 This app brings all upcoming contests into one clean place, with an easy way to add them directly to your calendar 📅. Hope you find it useful 🚀</span>

      <div class="flex flex-col gap-3">
        <span>Here are some links that may interest you 👀</span>

        <Button variant="secondary" href="https://github.com/therealsujitk/cp-contests" target="_blank">
          <GitHub /> GitHub Repository
        </Button>
        <Button variant="secondary" href="https://therealsuji.tk" target="_blank">
          <ContactRound /> About Me
        </Button>
        <Button variant="secondary" href="https://therealsuji.tk/donate" target="_blank">
          <HandHeart /> Donate
        </Button>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>