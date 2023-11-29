<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const center = ref({lat: 0, lng: 0});
const options = ref({
  styles: [
    // this is for specific styles we might want to have on the map
    // TODO: https://console.cloud.google.com/google/maps-apis/studio/styles?project=knowsy-406521
    // Use the above link to create styles for our map
  ]
});

const ready = ref(false);


onBeforeMount(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    center.value.lat = position.coords.latitude;
    center.value.lng = position.coords.longitude;
  })

  ready.value = true;
})
</script>

<template>
  <GMapMap
      :center="center"
      :zoom="14"
      style="height: 89vh; width: 100%; display: flex;"
  />
</template>

<style scoped>

</style>
