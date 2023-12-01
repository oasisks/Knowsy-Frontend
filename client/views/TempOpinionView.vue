<script setup lang="ts">
import FeedComponent from "@/components/FeedComponent.vue";
import OpinionList from "@/components/Opinion/OpinionList.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>


<template>
    <main>
      <h1>Opinions View</h1>
      <OpinionList />
    </main>
  </template>