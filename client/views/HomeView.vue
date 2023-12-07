<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import LocationResource from "../components/LocationResource/LocationResource.vue";
import LoginOrRegister from "../components/Login/LoginOrRegister.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <LocationResource v-if="isLoggedIn" />
    <LoginOrRegister v-else />

  </main>
</template>

<style scoped>

</style>
