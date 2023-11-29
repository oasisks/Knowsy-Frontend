<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const { currentUsername, isLoggedIn, radius, userCoords } = storeToRefs(useUserStore());
const center = ref({lat: 0, lng: 0});
const ready = ref(false);
const options = ref({
  styles: [
    // this is for specific styles we might want to have on the map
    // TODO: https://console.cloud.google.com/google/maps-apis/studio/styles?project=knowsy-406521
    // Use the above link to create styles for our map
  ]
});

const MITPOS = {lat: 42.3601, lng: 71.0942};
// first thing we need is to define the center location
// we either get it from the user or we set the default location to be MIT
center.value = isNaN(userCoords.value.position.lat) || isNaN(userCoords.value.position.lng) ? MITPOS : userCoords.value.position;

const markers = ref([{position: {}}])

// populate the map with markers
async function populateMarkers() {
  const longitude = center.value.lat.toString();
  const latitude = center.value.lng.toString();
  const query = {longitude, latitude};
  try {
    const locationResources = await fetchy('/api/radiusResources', "GET", {query});
    console.log(locationResources);
  } catch {

  }
}

onMounted(async () => {
  await populateMarkers();
})
</script>

<template>
  <GMapMap
      :center="center"
      :zoom="14"
      style="height: 89vh; width: 100%; display: flex;"
      >
      <GMapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      />
  </GMapMap>
  <p>{{ center }}</p>
</template>

<style scoped> 

</style>