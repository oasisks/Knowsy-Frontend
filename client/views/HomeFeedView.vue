<script setup lang="ts">
import PostsFeedComponent from "@/components/Post/PostsFeedComponent.vue";
import AnnouncementsFeedComponent from "@/components/RadiusResource/AnnouncementsFeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const currentTab = ref("Project Updates");

const tabs: any = {
  "Project Updates": PostsFeedComponent,
  Announcements: AnnouncementsFeedComponent,
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
      <div class="mb-10">
        <button
          class="bg-slate-400 hover:bg-slate-300 text-white font-semibold px-4 py-3 mr-2 rounded-md"
          v-for="(_, tab) in tabs"
          :key="tab"
          :class="['tab-button', { active: currentTab === tab.toString() }, { underline: currentTab === tab.toString() }]"
          @click="currentTab = tab.toString()"
        >
          {{ tab }}
        </button>
      </div>
      <component :is="tabs[currentTab]" class="tab"></component>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
