<script setup lang="ts">
import router from "@/router";
import { defineEmits, defineProps, onMounted, ref } from 'vue';
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["title", "description", "timeline", "status", "home", "opened", "clickable", "id", "currentUsername", "index"]);
const emit = defineEmits(["setMarker", "refreshFavorites", "updateMarkers"])
const clickable = ref(false);
const userId = ref<Record<string, string>>({});
const isFavorite = ref(false);

const posts = ref([]);
function goToProjectPage() {
    // this is the make shift solution
    // will work on making a large popup window on the same page for better experience
    if (clickable.value) {
        void router.push({path: `/projects/${props.id}`})
    }
}

async function findAllPosts() {
    try {
        if (props.clickable) {
            const post = await fetchy(`/api/projects/${props.id}/posts`, "GET");
        }
} catch(e) {
        console.error(e);
    }
}
async function addFavorite() {
    try {
        const msg = await fetchy(`/api/favorites/${props.id}`, "POST");
    } catch {

    }
    await isFavorited();
    emit("refreshFavorites");
    emit("updateMarkers", props.index, true)
}
async function removeFavorite() {
    try {
        const msg = await fetchy(`/api/favorites/${props.id}`, "DELETE");
    } catch {

    }
    await isFavorited();
    emit("refreshFavorites");
    emit("updateMarkers", props.index, false)
}

async function getUserID() {
    try {
        userId.value = await fetchy(`/api/users/${props.currentUsername}`, "GET");
    } catch {

    }
}

async function isFavorited() {
    const query = {author: userId.value._id};
    try {
        const favorites = await fetchy(`/api/favorites`, "GET")
        // console.log(favorites, props.id);
        const relatedFavorites = favorites.filter((favorite: Record<string, string>) => {
            return favorite.target === props.id;
        })
        isFavorite.value = relatedFavorites.length > 0;
    } catch {

    }
}

function setClickable() {
    clickable.value = props.clickable;
}

function setUnClickable() {
    clickable.value = false;
}

onMounted(async () => {
    await findAllPosts();
    await getUserID();
    await isFavorited();
})
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
    <div class="cursor-pointer">
        <div class="flex flex-row justify-between">
            <h1 @mouseover="setClickable" @mouseleave="setUnClickable" class="font-semibold">{{ props.title }}</h1>
            <div class="py-6 px-2 mx-2 my-2" v-if="props.clickable">
                <Button 
                    v-if="!isFavorite"
                    class="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded"
                    icon="pi pi-bookmark"
                    @click="addFavorite"
                    >
                </Button>
                <Button 
                    v-else
                    class="bg-sky-600 text-white py-2 px-4 rounded"
                    icon="pi pi-bookmark-fill"
                    @click="removeFavorite"
                    >
                </Button>
            </div>
        </div>
        <div @mouseover="setClickable" @mouseleave="setUnClickable" v-if="props.clickable" class="description">
            <p class="text-gray-500 dark:text-gray-400 font-bold text-lg">Description: </p>
            <p class="text-gray-500 dark:text-gray-400 font-medium text-sm">{{ props.description }}</p>
        </div>
        <div @mouseover="setClickable" @mouseleave="setUnClickable">
            <p v-if="props.clickable" class="text-sky-500 dark:text-sky-400 font-semibold text-sm">Click to see more...</p>
            <p v-else class="text-gray-500 dark:text-gray-400 font-semibold text-sm">This is your home location. Click around this map to see development projects in your area! To view updates from your neighbors, visit the feed page.</p>
        </div>
    </div>
</GMapInfoWindow>

</template>

<style scoped>
.description {
    overflow-wrap: break-word;
    display: flex;
    flex-direction: row;
    gap: 1.5em;
}
</style>