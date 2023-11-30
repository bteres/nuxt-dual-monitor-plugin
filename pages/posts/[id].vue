<script setup>
let t = ref({ opener: true });

if (process.browser) {
  t.value = window;
}
</script>

<template>
  <div>
    <div
      class="header"
      style="background-color: black; color: white; font-size: xx-large"
      v-if="!t?.opener"
    >
      Header
    </div>
    <h1>{{ $route.params.id }}</h1>
  </div>
</template>
