<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

let view = ref("posts");

async function goToSettings() {
    void router.push({ name: "Settings" });
}

</script>

<template>
    <main class="column">
        <div class="header">
            <div class="pfp"></div>
            <h1>Profile for {{ currentUsername }}</h1>

            <button class="pure-button pure-button-primary" @click="goToSettings">Settings</button>
        </div>
        <div class="pf-bar">
            <ul>
                <li>Posts</li>
                <li>Opinions</li>
                <li>Events</li>
                <li>Saved</li>
            </ul>
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
