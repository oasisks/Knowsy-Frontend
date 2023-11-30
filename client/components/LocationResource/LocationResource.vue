<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import LocationPanel from "./LocationPanel.vue";

const { currentUsername, isLoggedIn, userCoords } = storeToRefs(useUserStore());
const center = ref({lat: 0, lng: 0});
const ready = ref(false);
const currentMarkerId = ref(-1);
const options = ref({
  mapId: 'eeb313ac772d983a'
  // styles: [
  //   // this is for specific styles we might want to have on the map
  //   // TODO: https://console.cloud.google.com/google/maps-apis/studio/styles?project=knowsy-406521
  //   // Use the above link to create styles for our map
  // ]
});

const MITPOS = {lat: 42.3601, lng: 71.0942};
// first thing we need is to define the center location
// we either get it from the user or we set the default location to be MIT
center.value = isNaN(userCoords.value.position.lat) || isNaN(userCoords.value.position.lng) ? MITPOS : userCoords.value.position;

const projects = ref([{id: -1, position: center.value, title: "Home Location", status: "NAN", description: "It is my home :)", home: true}]);

// populate the map with markers
async function populateMarkers() {
  const longitude = center.value.lng.toString();
  const latitude = center.value.lat.toString();
  const radius = "2";
  const query = {longitude, latitude, radius};
  // add in the markers
  try {
    const locationResources = await fetchy('/api/locationResources', "GET", {query});
    console.log(locationResources);
    let id = 0;
    locationResources.forEach((locationResource: any) => {
      console.log(locationResource);
      // for each project, add in the project title, content, and critical dates
      const position = locationResource.location.coordinates;
      const description = locationResource.description;
      const title = locationResource.name;
      const status = locationResource.status;
      projects.value.push({id, position: {lng: position[0], lat: position[1]}, title, status, description, home: false});
      id++;
    })
  } catch {

  }
}

function openMarker(id: number) {
  currentMarkerId.value = id;
  console.log(currentMarkerId.value);
}

onMounted(async () => {
  await populateMarkers();
})
</script>

<template>
  <GMapMap
      :center="center"
      :zoom="14"
      :options="options"
      style="height: 89vh; width: 100%; display: flex;"
      >
      <GMapMarker
      :key="index"
      v-for="(project, index) in projects"
      :position="project.position"
      :clickable="true"
      @click="openMarker(project.id)"
      @closeclick="openMarker(-1)"
      >
      <LocationPanel 
        :title="project.title" 
        :description="project.description" 
        :status="project.status"
        :home="project.home" 
        :opened="currentMarkerId === project.id"
        :clickable="project.id !== -1"
        @set-marker="openMarker"/>
    </GMapMarker>
  </GMapMap>
  <p>{{ center }}</p>
  <p>{{ currentMarkerId }}</p>
  <p>{{ projects }}</p>
</template>

<style scoped> 

</style>