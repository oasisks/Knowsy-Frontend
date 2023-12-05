<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import Posts from "../components/Post/UserPostsComponent.vue";
// import opinions, events, saved

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function goToSettings() {
  void router.push({ name: "Settings" });
}

const currentTab = ref("Posts");

const tabs: any = {
  Posts: Posts,
  Opinions: Posts,
};
</script>

<template>
  <main class="justify-center">
    <div class="mx-10 my-8 py-6 rounded-lg text-center bg-slate-100">
      <div class="mb-10">
        <h1 class="">{{ currentUsername }}</h1>
        <button class="pure-button pure-button-primary" @click="goToSettings">Settings</button>
      </div>
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
