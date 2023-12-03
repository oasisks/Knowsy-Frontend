<script setup lang="ts">

import router from "@/router";
import { ref } from "vue";

const radius = ref(0);

async function next() {
    void router.push({ name: "Home" });
}
</script>
  
<template>
    <form class="pure-form pure-form-aligned" @submit.prevent="next">
        <h3>Tell us more!</h3>
        <fieldset>
            <div class="pure-control-group">
                <label for="aligned-longitude">Longitude</label>
                <input v-model.trim="longitude" type="text" id="aligned-name" placeholder="longitude" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-latitude">Latitude</label>
                <input v-model.trim="latitude" id="aligned-latitude" placeholder="latitude" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-radius">Radius</label>
                <input v-model.trim="radius" id="aligned-radius" placeholder="radius" required />
            </div>
            <div class="pure-controls">
                <button type="submit" class="pure-button pure-button-primary">Register</button>
            </div>
        </fieldset>
    </form>
</template>