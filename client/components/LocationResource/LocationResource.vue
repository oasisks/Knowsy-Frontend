<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import LocationPanel from "./LocationPanel.vue";

const { currentUsername, isLoggedIn, userCoords, rad } = storeToRefs(useUserStore());
const ready = ref(false);
const currentMarkerId = ref(-1);
const homeIcon = ref<Record<string, any>>({});
const regularIcon = ref<Record<string, any>>({});
const favoriteIcon = ref<Record<string, any>>({});
const favorites = ref<Set<string>>(new Set());

homeIcon.value = {
    url: "https://maps.google.com/mapfiles/kml/paddle/wht-stars.png",
    scaledSize: {width: 40, height: 40},
    labelOrigin: {x: 16, y: -10}
}

regularIcon.value = {
  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  scaledSize: {width: 40, height: 40},
  labelOrigin: {x: 16, y: -10}
}

favoriteIcon.value = {
  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  scaledSize: {width: 40, height: 40},
  labelOrigin: {x: 16, y: -10},
}

const options = ref({
  mapId: 'eeb313ac772d983a'
  // styles: [
  //   // this is for specific styles we might want to have on the map
  //   // TODO: https://console.cloud.google.com/google/maps-apis/studio/styles?project=knowsy-406521
  //   // Use the above link to create styles for our map
  // ]
});
// first thing we need is to define the center location
// we either get it from the user or we set the default location to be MIT

const projects = ref([{id: -1, position: userCoords.value.position, title: "Home Location", status: "NAN", description: "It is my home :)", home: true, favorite: false}]);

async function getFavorites() {
  try {
    favorites.value = new Set();
    const _favorites = await fetchy("api/favorites", "GET");
    _favorites.forEach((favorite: any) => {
        favorites.value.add(favorite.target);
    })
  } catch {

  }
}

// populate the map with markers
async function populateMarkers() {
  await getFavorites();
  const longitude = userCoords.value.position.lng.toString();
  const latitude = userCoords.value.position.lat.toString();
  const radius = rad.value.toString();
  const query = {longitude, latitude, radius};
  // add in the markers
  try {
    const locationResources = await fetchy('/api/locationResources', "GET", {query});
    let id;
    locationResources.forEach((locationResource: any) => {
      id = locationResource._id;
      // for each project, add in the project title, content, and critical dates
      const position = locationResource.location.coordinates;
      const description = locationResource.description;
      const title = locationResource.name;
      const status = locationResource.status;
      projects.value.push({id, position: {lng: position[0], lat: position[1]}, title, status, description, home: false, favorite: favorites.value.has(id)});
    })
  } catch {

  }
}

function openMarker(id: number) {
  currentMarkerId.value = id;
}

function updateMarker(index: number, isFavorite: boolean) {
  projects.value[index].favorite = isFavorite;
}

onMounted(async () => {
  await populateMarkers();
})
</script>

<template>
  <GMapMap
      :center="userCoords.position"
      :zoom="14"
      :options="options"
      style="height: 91.9vh; width: 100%; display: flex;"
      >
      <GMapMarker
      :key="project.favorite"
      v-for="(project, index) in projects"
      :position="project.position"
      :clickable="true"
      :icon='(project.home) ? homeIcon : ((project.favorite) ? favoriteIcon : regularIcon)'
      @click="openMarker(project.id)"
      @closeclick="openMarker(-1)"
      >
      <LocationPanel 
        :current-username="currentUsername"
        :id="project.id"
        :index="index"
        :title="project.title" 
        :description="project.description" 
        :status="project.status"
        :home="project.home" 
        :opened="currentMarkerId === project.id"
        :clickable="project.id !== -1"
        @set-marker="openMarker"  
        @refresh-favorites="getFavorites"
        @update-markers="updateMarker"/>
    </GMapMarker>
  </GMapMap>
</template>

<style scoped> 

</style>