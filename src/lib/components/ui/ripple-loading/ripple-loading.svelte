<script lang="ts">
  const { width, class: containerClass }: { width: number, class?: string } = $props();
</script>

<div class={["container relative", containerClass]} style={`width: ${width}px; height: ${width}px;`}>
  <span class="absolute block rounded-full top-[50%] start-[50%] translate-[-50%] bg-[#FF8C00]" style={`width: ${width / 2.5}px; height: ${width / 2.5}px;`}></span>
  <span class="pulse block w-full h-full rounded-full bg-[#FF8C00]"></span>
</div>

<style>
  .pulse {
    animation: pulse-animation 1.2s linear infinite;
  }

  @keyframes pulse-animation {
    0% {
      transform: scale(0.15);
      opacity: 0;
    }

    50% {
      opacity: 0.7;
    }

    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
