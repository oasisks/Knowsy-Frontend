<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import RadiusResourceOverviewComponent from "@/components/RadiusResource/RadiusResourceOverviewComponent.vue";
import RadiusResourceMapPollsComponent from "@/components/RadiusResource/RadiusResourceMapPollsComponent.vue";
import OpinionList from "@/components/Opinion/OpinionList.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="sm:mx-12 sm:my-10 mx-4 my-3">
    <section v-if="isLoggedIn">
      <div class="grid grid-cols-3">
        <div class="col-span-2">
          <RadiusResourceOverviewComponent v-bind:resourceId="$route.params._id" />
          <OpinionList v-bind:rootId="$route.params._id" :profile="false" />
        </div>
        <div>
          <RadiusResourceMapPollsComponent v-bind:resourceId="$route.params._id" />
        </div>
      </div>
    </section>
    <h1 v-else>Please login!</h1>
  </main>
</template>
