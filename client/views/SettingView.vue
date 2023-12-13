<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}

async function back() {
  void router.push({ name: "Profile" });
}
</script>

<template>
  <main class="column text-center my-10">
    <button class="bg-slate-400 hover:bg-slate-300 text-white font-semibold px-5 py-3 mr-2 rounded-md" @click="back">Back</button>
    <h1 class="font-semibold">Settings for {{ currentUsername }}</h1>
    <button class="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-3 mr-2 rounded-md" @click="logout">Logout</button>
    <button class="bg-slate-400 hover:bg-slate-300 text-white font-semibold px-5 py-3 mr-2 rounded-md" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>
