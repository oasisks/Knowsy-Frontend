<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function goToSettings() {
    void router.push({ name: "Settings" });
}

</script>

<template>
    <main class="column">
        <h1>Profile for {{ currentUsername }}</h1>
        <button class="pure-button pure-button-primary" @click="goToSettings">Settings</button>

    </main>
</template>
