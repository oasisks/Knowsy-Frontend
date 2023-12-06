<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import Opinions from "../components/Opinion/UserOpinionsComponent.vue";
import Posts from "../components/Post/UserPostsComponent.vue";
// import opinions, events, saved

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

let view = ref("posts");

async function goToSettings() {
  void router.push({ name: "Settings" });
}

const currentProperties = computed(() => {
  if (currentTab.value === "Opinions") {
    return { rootId: currentUsername.value, profile: true };
  } else {
    return {};
  }
});

const currentTab = ref("Posts");

const tabs: any = {
  Posts: Posts,
  Opinions: Opinions,
  Events: Posts,
  Saved: Posts,
};
</script>

<template>
  <main class="justify-center">
    <div class="mx-10 my-8 py-6 rounded-lg text-center bg-slate-100">
      <div class="mb-10">
        <h1 class="">{{ currentUsername }}</h1>
        <button class="pure-button pure-button-primary" @click="goToSettings">Settings</button>
      </div>
      <button class="pure-button pure-button-primary" v-for="(_, tab) in tabs" :key="tab"
        :class="['tab-button', { active: currentTab === tab.toString() }, { underline: currentTab === tab.toString() }]"
        @click="currentTab = tab.toString()">
        {{ tab }}
      </button>
      <component :is="tabs[currentTab]" v-bind="currentProperties" class="tab"></component>
    </div>
  </main>
</template>

<style>
.pfp {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
}
</style>
