<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername, rad, userCoords } = storeToRefs(useUserStore());

let username = ref("");
let password = ref("");
let r = ref();
let loc = ref();
const error = ref(false);
const success = ref(false);

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
  // once we click the thing, we want to first ask for location
  navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = pos.coords;
      console.log(coords);

      // longitude, latitude
      const location: Array<number> = [coords.longitude, coords.latitude];
      await updateUser({location});
      error.value = false;
      success.value = true;
  }, ((err) => {
    error.value = true;
  }))
}

</script>

<template>
  <h2 class="text-2xl font-bold mt-10 mb-4">Update your user details:</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend class="text-lg font-semibold">Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" class="mr-4" required />
      <button type="submit" class="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-3 mr-2 rounded-md">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend class="text-lg font-semibold">Change your password</legend>
      <input type="password" placeholder="New password" v-model="password" class="mr-4" required />
      <button type="submit" class="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-3 mr-2 rounded-md">Update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateRadius" class="pure-form">
    <fieldset>
      <legend class="text-lg font-semibold">Change the radius of projects you would like to see</legend>
      <p class="my-2">Your current radius: {{ rad }}km</p>
      <input type="number" min="1" placeholder="Update radius" v-model="r" class="mr-4" required />
      <button type="submit" class="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-3 mr-2 rounded-md">Update radius</button>
    </fieldset>
  </form>

  <p class="text-lg font-semibold">Update your location</p>
  <button type="submit" class="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-3 mr-2 rounded-md" @click="updateLocation"> Update location</button>
  <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-2" role="alert">
      <strong class="font-bold">Uh oh! </strong>
      <span class="block sm:inline">You need to allow access to location for it to update 😠 !</span>
  </div>

  <div v-if="success" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-2" role="alert">
      <strong class="font-bold">Yay! </strong>
      <span class="block sm:inline">Location successfully updated 😊</span>
  </div>
</template>
