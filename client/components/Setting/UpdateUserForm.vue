<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { storeToRefs } from "pinia";

const { currentUsername, radius, userCoords } = storeToRefs(useUserStore());

let username = ref("");
let password = ref("");
let r = ref();
let loc = ref();

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}

async function updateRadius() {
  await updateUser({ radius: r.value });
  await updateSession();
}

async function updateLocation() {
  //Todo
  await updateUser({ location: loc.value })
}

</script>

<template>
  <h2>Update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" required />
      <button type="submit" class="pure-button pure-button-primary">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>Change your password</legend>
      <input type="password" placeholder="New password" v-model="password" required />
      <button type="submit" class="pure-button pure-button-primary">Update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateRadius" class="pure-form">
    <fieldset>
      <legend>Change the Radius of projects you would like to see</legend>
      <p> Current Radius: {{ radius }}</p>
      <input type="number" min="1" placeholder="Update radius" v-model="r" required />
      <button type="submit" class="pure-button pure-button-primary">Update radius</button>
    </fieldset>
  </form>

  <p> Current Location: {{ userCoords }}</p>
  <button type="submit" class="pure-button pure-button-primary" @click="updateLocation"> Update location</button>
</template>
