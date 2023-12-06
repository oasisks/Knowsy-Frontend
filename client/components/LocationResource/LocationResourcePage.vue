<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineProps, onMounted, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';
import SmallMap from "../Map/SmallMap.vue";
import Poll from "../Poll/Poll.vue";

const props = defineProps(["id"]);

const title = ref("Default Title");

// fix this later, updated will change base on if its been updated x minutes ago, x hours ago, x days ago, x weeks ago, and x years ago 
const updated = ref(new Date());
const projectDescription = ref("Default Description");
const posts = ref(["Default Post Content"]);
const events = ref([]);
const polls = ref([]);
const projectCoords = ref({lng: 0, lat: 0});
const items = ref(Array.from({ length: 100000 }).map((_, i) => `Item #${i}`));


async function getProject() {
    try {
        // we are going to assume that there is only one element within the output
        const project = (await fetchy(`/api/locationResources/${props.id}`, "GET"))[0];
        title.value = project.name;
        projectDescription.value = project.description;
        updated.value = new Date(project.start);        
        projectCoords.value.lng = project.location.coordinates[0];
        projectCoords.value.lat = project.location.coordinates[1];
    } catch {

    }
}
const {userCoords} = storeToRefs(useUserStore());

onMounted(async () => {
    await getProject();
})
</script>

<template>
    <div class="row-flex">
        <div class="col-flex-left">
            <Card>
                <template #title> {{ title }} </template>
                <template #subtitle> Last Updated: {{ updated }}</template>
                <template #content>
                    <p><b>Project Description: </b>{{ projectDescription }}</p>
                    <div class="posts">
                        <Card>
                            <template #title>Posts</template>
                            <template #content>
                                <ScrollPanel style="width: 100%; height: 10em;">
                                    <p v-for="post in posts">{{ post }}</p>
                                </ScrollPanel>
                            </template>
                        </Card>
                    </div>
                    <div class="actionables">
                        <Card>
                            <template #title> Current Actionables</template>
                            <template #content>
                                <ScrollPanel style="width: 100%; height:10em;">
                                    <p>dsadsadsadsadas</p>
                                </ScrollPanel>
                            </template>
                        </Card>
                    </div>
                </template>

            </Card>
        </div>
        <div class="col-flex-right">
            <SmallMap :project-coords="projectCoords"/>
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