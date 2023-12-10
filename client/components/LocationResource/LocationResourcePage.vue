<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineProps, onMounted, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';
import DateFormat from "../DateFormat/DateFormat.vue";
import EventList from '../Event/EventList.vue';
import SmallMap from "../Map/SmallMap.vue";
import Poll from "../Poll/Poll.vue";
import PostsScroll from '../Post/PostsScroll.vue';

const props = defineProps(["id"]);
const postContent = ref("");
const title = ref("Default Title");
const posts = ref<Array<Record<string, string>>>([]);

// fix this later, updated will change base on if its been updated x minutes ago, x hours ago, x days ago, x weeks ago, and x years ago 
const updated = ref(new Date());
const projectDescription = ref("Default Description");
const events = ref([]);
const projectCoords = ref({ lng: 0, lat: 0 });
const visible = ref(false);
const finished = ref(false);


async function getProject() {
    try {
        // we are going to assume that there is only one element within the output
        const project = (await fetchy(`/api/locationResources/${props.id}`, "GET"));
        title.value = project.name;
        projectDescription.value = project.description;
        updated.value = new Date(project.start);
        projectCoords.value.lng = project.location.coordinates[0];
        projectCoords.value.lat = project.location.coordinates[1];
    } catch {

    }
}

async function getPosts() {
    // this grabs all of the posts associated with this project
    try {
        posts.value = await fetchy(`/api/projects/${props.id}/posts`, "GET");
    } catch {

    }
}

async function createPost() {
    if (postContent.value.length === 0) { return; }
    visible.value = false;
    const query = { project: props.id, content: postContent.value };
    try {
        await fetchy(`/api/posts`, "POST", { query });
    } catch {

    }
    await getPosts();
}
const { userCoords } = storeToRefs(useUserStore());

onMounted(async () => {
    await getProject();
    await getPosts();
    finished.value = true;
})
</script>

<template>
    <div class="row-flex" v-if="finished">
        <div class="col-flex-left">
            <Card>
                <template #title> {{ title }} </template>
                <template #subtitle>
                    <DateFormat :date="updated" />
                </template>
                <template #content>
                    <p><b>Project Description: </b>{{ projectDescription }}</p>
                    <div class="posts">
                        <Card>
                            <template #title>
                                <div class="flex flex-row justify-between">
                                    <p>Posts</p>
                                    <Button class="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded"
                                        icon="pi pi-plus" @click="visible = true">
                                    </Button>
                                </div>
                            </template>
                            <template #content>
                                <Dialog v-model:visible="visible" modal header="Create Post" :style="{ width: '50rem' }"
                                    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :dismissable-mask="true"
                                    v-on:after-hide="postContent = ''">
                                    <div class="flex flex-col gap-3">
                                        <p class="text-sm font-medium">Create your own awesome post!</p>
                                        <InputText type="text" v-model="postContent"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Post Content" @keyup.enter="createPost" />
                                        <div v-if="postContent.length === 0"
                                            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                            role="alert">
                                            <strong class="font-bold">NOTE: </strong>
                                            <span class="block sm:inline">Needs some content to create post</span>
                                        </div>
                                        <Button class="bg-sky-500 hover:bg-sky-600 text-white py-3 w-full rounded"
                                            label="Create Post" @click="createPost">
                                        </Button>
                                    </div>
                                </Dialog>
                                <div class="w-full h-full">
                                    <PostsScroll :posts="posts" />
                                </div>

                            </template>
                        </Card>
                    </div>
                    <div class="actionables">
                        <EventList :projectId="$props.id" />
                    </div>
                </template>

            </Card>
        </div>
        <div class="col-flex-right">
            <SmallMap :project-coords="projectCoords" />
            <Poll :id="$props.id" />
        </div>
    </div>
</template>

<style scoped>
.row-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2.5em;
}

.col-flex-left {
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    width: 60%;
}

.col-flex-right {
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    width: 37%;
}

.actionables {
    margin-top: 3.5em;
}

.posts {
    margin-top: 2.5em;
}
</style>