<script setup lang="ts">
import router from "@/router";
import { defineEmits, defineProps } from 'vue';
import LocationResourcePage from "./LocationResourcePage.vue";

const props = defineProps(["title", "description", "timeline", "status", "home", "opened", "clickable"])
const emit = defineEmits(["setMarker"])

function goToProjectPage() {
    // this is the make shift solution
    // will work on making a large popup window on the same page for better experience
    if (props.clickable) {
        router.addRoute({
        path: `/projects/${props.title.replace(" ", "")}`,
        component: LocationResourcePage,
        props: {
            title: props.title,
            description: props.description
        }
    })
    void router.push({path: `/projects/${props.title.replace(" ", "")}`});
    }
    else {
        return;
    }

}

</script>

<template>

<GMapInfoWindow 
    :opened="props.opened"
    @click="goToProjectPage()"
    >
    <div>
        <h1>{{ props.title }}</h1>
        <div v-if="props.clickable">
            <p>{{ props.description }}</p>
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
</GMapInfoWindow>

</template>

<style scoped>
</style>