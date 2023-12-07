<script setup lang="ts">
import OpinionList from "@/components/Opinion/OpinionList.vue";
import PostOverviewComponent from "@/components/Post/PostOverviewComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
    <main class="sm:mx-12 sm:my-10 mx-4 my-3">
        <section v-if="isLoggedIn">
            <PostOverviewComponent v-bind:postid="$route.params._id" />
            <OpinionList v-bind:rootId="$route.params._id" :profile="false" />
        </section>
        <h1 v-else>Please login!</h1>
    </main>
</template>
