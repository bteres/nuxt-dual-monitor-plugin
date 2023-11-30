<script setup>
const { $secondWindowName } = useNuxtApp();
let thisWindow = ref({ name: $secondWindowName });

if (process.browser) {
  thisWindow.value = window;
}
</script>

<template>
  <div>
    <div
      class="header"
      style="background-color: black; color: white; font-size: xx-large"
      v-if="!(thisWindow?.name === $secondWindowName)"
    >
      Header
    </div>
    <h1>{{ $route.params.id }}</h1>
  </div>
</template>
