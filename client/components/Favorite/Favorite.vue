<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import router from "@/router";

const loaded = ref(false);

let favorites = ref<Array<Record<string, string>>>([]);
let projects = ref<Array<Record<string, string>>>([]);


async function getFavorites() {
    let response;
    try {
        response = await fetchy(`/api/favorites`, "GET");
    } catch {
        return;
    }
    console.log("response", response);
    favorites.value = response;
};

async function getProject(project: string) {
    let response;
    try {
        response = await fetchy(`/api/locationResources/${project}`, "GET");
    } catch {
        return;
    }
    return response;
    
}

async function toLink(projectId: string) {
    void router.push({path: `/projects/${projectId}`})
}

onBeforeMount(async () => {
  await getFavorites();
  const pros = [];
  for (const favorite of favorites.value) {
    pros.push(await getProject(favorite.target))
  }
  console.log("here", pros)
  projects.value = pros;
  loaded.value = true;
  console.log("frontned", projects);
});

</script>


<template>

  <!-- <h2>Favorites</h2> -->

  <div class="favorites">
    <article v-for="project in projects" :key="project._id" class="project">
        <Card @click="toLink(project._id)" class="card hover: cursor-pointer">
            <template #title>
                {{ project.name }}
            </template>
            <template #content>
                {{ project.description }}
            </template>
        </Card>
    </article>
  </div>

</template>


<style scoped>

.card {
    margin: 20px;
}

</style>



