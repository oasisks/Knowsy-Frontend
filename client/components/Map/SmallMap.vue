<script setup lang="ts">
import { onMounted, ref } from "vue";
const props = defineProps(["projectCoords"]);
const currentMarkerId = ref(false);


function openMarker(state: boolean) {
  currentMarkerId.value = state;
}
</script>

<template>
    <Card>
        <template #title>
            <div class="text-black">Map</div>
        </template>
        <template #content>
            {{  }}
            <GMapMap style="height: 35vh;" :center="props.projectCoords" :zoom="14">
                <GMapMarker
                    :position="props.projectCoords"
                    :clickable="true"
                    @click="openMarker(true)"
                    >
                    <GMapInfoWindow 
                        :opened="currentMarkerId"
                        :closeclick="true"
                        @closeclick="openMarker(false)"
                        :options="{
                            pixelOffset: {
                                    width: 10, height: 0
                                },
                                maxWidth: 320,
                                maxHeight: 320,
                        }">
                        <p>Current Location</p>
                    </GMapInfoWindow>
                </GMapMarker>
            </GMapMap>
        </template>
    </Card>
</template>

<style scoped>
</style>