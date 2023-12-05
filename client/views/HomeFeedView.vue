<script setup lang="ts">
import FeedComponent from "@/components/FeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <!-- <h1>Home Feed</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section> -->
    <div class="sm:mx-16 sm:my-10 mx-4 my-3">
      <FeedComponent />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
