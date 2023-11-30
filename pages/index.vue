<script setup lang="ts">
const items = ref([...Array(10).keys()]);
</script>

<template>
  <div>
    <h1>Dual Screen Display</h1>
    <button
      v-if="
        $isMultiScreenSupported.value &&
        $isThereASecondScreen.value &&
        !$isSingleScreenPreference.value &&
        $windowManagementPermission.value === 'prompt'
      "
      @click="$setScreenDetails()"
    >
      Detect Screens
    </button>
    <button
      v-if="
        !$isSingleScreenPreference.value &&
        $windowManagementPermission.value === 'prompt'
      "
      @click="$isSingleScreenPreference.value = true"
    >
      Cancel
    </button>
    <div v-for="item in items">
      <button @click="$openLink(`/posts/${item}`)">
        {{ item }}
      </button>
    </div>
  </div>
</template>
