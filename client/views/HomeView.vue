<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const center = ref({lat: 51.093048, lng: 6.842120});
const markers = ref([
        {
          position: {
            lat: 51.093048, lng: 6.842120
          },
        }
        , // Along list of clusters
      ]);

</script>

<template>
  <GMapMap
        :center="{lat: 51.093048, lng: 6.842120}"
        :zoom="7"
        style="height: 100vw;"
    />
</template>

<style scoped>

</style>
