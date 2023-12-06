<script setup lang="ts">
import FeedComponent from "@/components/FeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const currentTab = ref("Posts");

const tabs: any = {
  Posts: FeedComponent,
  Announcements: FeedComponent,
};
</script>

<template>
  <main>
    <!-- <h1>Home Feed</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section> -->
    <div class="sm:mx-16 sm:my-10 mx-4 my-3">
      <!-- <FeedComponent /> -->
      <button
        class="pure-button pure-button-primary"
        v-for="(_, tab) in tabs"
        :key="tab"
        :class="['tab-button', { active: currentTab === tab.toString() }, { underline: currentTab === tab.toString() }]"
        @click="currentTab = tab.toString()"
      >
        {{ tab }}
      </button>
      <component :is="tabs[currentTab]" class="tab"></component>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
