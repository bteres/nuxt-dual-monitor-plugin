<script setup lang="ts">
const items = ref([...Array(10).keys()]);
</script>

<template>
  <div>
    <h1>How to use multiple screens</h1>
    <h1>{{ $hello("world") }}</h1>
    <div>
      <div>
        Permission Status:
        <span id="permissionStatus">{{ $screenDetails.value }}</span>
      </div>
      <div>
        Screens Available:
        <span id="screensAvail">{{ $numScreens }}</span>
      </div>
    </div>
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
      <button @click="$create(`/posts/${item}`)">
        {{ item }}
      </button>
    </div>
  </div>
</template>
