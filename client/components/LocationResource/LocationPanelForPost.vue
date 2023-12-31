<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, onMounted, ref } from 'vue';
import { fetchy } from "../../utils/fetchy";
import PostsScroll from "../Post/PostsScroll.vue";
const props = defineProps(["postid"]);
const emit = defineEmits(["setMarker"])
const userId = ref<Record<string, string>>({});
const projectId = ref("");
const name = ref("");
const description = ref("default description");
const clickable = ref(false);

const isFavorite = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const posts = ref([]);

async function getProject() {
    try {
        const post = await fetchy(`/api/posts/${props.postid}`, "GET");
        const project = await fetchy(`/api/locationResources/${post.project}`, "GET");
        projectId.value = project._id;
        name.value = project.name;
        description.value = project.description;
    } catch (e) {
        console.error(e);
    }
}

function goToProjectPage() {
    if (clickable.value) {
        void router.push({ path: `/projects/${projectId.value}` });
    }
}

async function getPosts() {
    try {
        let projectPosts = await fetchy(`/api/projects/${projectId.value}/posts`, "GET", {});
        posts.value = posts.value.concat(projectPosts);
    } catch (_) {
        return;
    }
}
async function addFavorite() {
    try {
        const msg = await fetchy(`/api/favorites/${projectId.value}`, "POST");
    } catch {

    }
    await isFavorited();
}

async function removeFavorite() {
    try {
        const msg = await fetchy(`/api/favorites/${projectId.value}`, "DELETE");
    } catch {

    }
    await isFavorited();
}

async function getUserID() {
    try {
        userId.value = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    } catch {

    }
}

async function isFavorited() {
    const query = { author: userId.value._id };
    try {
        const favorites = await fetchy(`/api/favorites`, "GET")
        // console.log(favorites, props.id);
        const relatedFavorites = favorites.filter((favorite: Record<string, string>) => {
            return favorite.target.toString() === projectId.value;
        })
        isFavorite.value = relatedFavorites.length > 0;
        console.log("favorite?", relatedFavorites)
    } catch {

    }
}

function setClickablle() {
    clickable.value = true;
}

function setUnClickable() {
    clickable.value = false;
}

onMounted(async () => {
    await getProject();
    await getPosts();
    await getUserID();
    await isFavorited();
})
</script>

<template>
    <div @click="goToProjectPage()">
        <div class="flex flex-row justify-between">
            <h1 @mouseover="setClickablle" @mouseleave="setUnClickable" class="font-semibold cursor-pointer">{{ name }}</h1>
            <div class="flex py-6 px-2">
                <Button v-if="!isFavorite" class="bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded"
                    icon="pi pi-bookmark" @click="addFavorite">
                </Button>
                <Button v-else class="bg-sky-700 text-white py-2 px-4 rounded" icon="pi pi-bookmark-fill"
                    @click="removeFavorite">
                </Button>
            </div>
        </div>
        <p @mouseover="setClickablle" @mouseleave="setUnClickable" class="text-gray-500 dark:text-gray-400 font-bold text-lg cursor-pointer">Description: </p>
        <p @mouseover="setClickablle" @mouseleave="setUnClickable" class="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6 cursor-pointer">{{ description }}</p>
        <p @mouseover="setClickablle" @mouseleave="setUnClickable" class="text-gray-500 dark:text-gray-400 font-bold text-lg cursor-pointer">Project Updates: </p>
        <ScrollPanel style="width: 100%; height: 20em;">
            <PostsScroll v-bind:posts="posts" />
        </ScrollPanel>
        <p @mouseover="setClickablle" @mouseleave="setUnClickable" class="mt-10 text-sky-500 dark:text-gray-400 font-normal text-sm cursor-pointer">Click to see more...</p>
    </div>
</template>

<style scoped>
.description {
    overflow-wrap: break-word;
    display: flex;
    flex-direction: row;
    gap: 1.5em;
}
</style>