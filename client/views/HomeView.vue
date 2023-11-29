<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import LocationResource from "../components/LocationResource/LocationResource.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());const isDebugMode = ref(true);
</script>

<template>
  <main>
    <LocationResource v-if="isLoggedIn || isDebugMode" />
    <p v-else>Not logged in</p>

  </main>
</template>

<style scoped>

</style>
