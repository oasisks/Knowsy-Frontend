<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import PostComponentForFeed from "./PostComponentForFeed.vue";
// import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn, rad, userCoords } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPosts() {
  // TODO: switch out once user radius is able to be set
  // let locationResourceQuery: Record<string, string> = { latitude: latitude, longitude: longitude, radius: radius.toString() };
  const lng = userCoords.value.position.lng.toString();
  const lat = userCoords.value.position.lat.toString();
  const radius = rad.value.toString();
  const query = { longitude: lng, latitude: lat, radius };
  let projects;
  try {
    projects = await fetchy("/api/locationResources", "GET", { query });
    for (let project of projects) {
      let projectPosts = await fetchy(`/api/projects/${project._id}/posts`, "GET", {});
      posts.value = posts.value.concat(projectPosts);
    }
    posts.value.sort(function (a, b) {
      return new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
    });
  } catch (_) {
    return;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <div>
    <div class="row">
      <h2 class="text-2xl font-bold mb-8" v-if="!searchAuthor">Project Updates:</h2>
      <h2 v-else>Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm @getPostsByAuthor="getPosts" />
    </div>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <div class="space-y-6">
        <article v-for="post in posts" :key="post._id">
          <PostComponentForFeed v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        </article>
      </div>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </div>
</template>

<!-- <style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style> -->
