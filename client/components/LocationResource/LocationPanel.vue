<script setup lang="ts">
import router from "@/router";
import { defineEmits, defineProps } from 'vue';

const props = defineProps(["title", "description", "timeline", "status", "home", "opened", "clickable", "id"])
const emit = defineEmits(["setMarker"])

function goToProjectPage() {
    // this is the make shift solution
    // will work on making a large popup window on the same page for better experience
    
    void router.push({path: `/projects/${props.id}`})
}

function findAllPosts() {
    try {
        // const posts = fetchy()
    } catch {

    }
}

</script>

<template>

<GMapInfoWindow 
    :opened="props.opened"
    @click="goToProjectPage()"
    :options="{
        pixelOffset: {
                width: 10, height: 0
              },
              maxWidth: 320,
              maxHeight: 320,
    }"
    >
    <div>
        <h1>{{ props.title }}</h1>
        <div v-if="props.clickable" class="description">
            <p>Description: {{ props.description }} </p>
            <ol>
                <li>Post 1</li>
                <li>Post 2</li>
                <li>Post 3</li>
                <li>Post 4</li>
                <li>Post 5</li>
            </ol>

            <p>Click to see more</p>
        </div>
        <p v-else>This is your home location</p>

    </div>
    <p>{{ props.id }}</p>
</GMapInfoWindow>

</template>

<style scoped>
.description {
    overflow-wrap: break-word;
}
</style>