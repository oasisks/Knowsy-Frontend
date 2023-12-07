<script setup lang="ts">
import PostComponent2 from "@/components/Post/PostComponent2.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn, radius } = storeToRefs(useUserStore());
const center = ref({ lat: 0, lng: 0 });

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPosts(latitude: string, longitude: string) {
  // TODO: switch out once user radius is able to be set
  // let locationResourceQuery: Record<string, string> = { latitude: latitude, longitude: longitude, radius: radius.toString() };
  let locationResourceQuery: Record<string, string> = { latitude: latitude, longitude: longitude, radius: "50" };
  let projects;
  try {
    projects = await fetchy("/api/locationResources", "GET", { query: locationResourceQuery });
    for (let project of projects) {
      let projectPosts = await fetchy(`/api/projects/${project._id}/posts`, "GET", {});
      posts.value = posts.value.concat(projectPosts);
    }
  } catch (_) {
    return;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  navigator.geolocation.getCurrentPosition((position) => {
    center.value.lat = position.coords.latitude;
    center.value.lng = position.coords.longitude;
  });
  await getPosts(center.value.lat.toString(), center.value.lng.toString());
  loaded.value = true;
});
</script>

<template>
  <div>
    <div class="row">
      <h2 class="text-2xl font-bold mb-8" v-if="!searchAuthor">Posts:</h2>
      <h2 v-else>Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm @getPostsByAuthor="getPosts" />
    </div>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <div class="space-y-6">
        <article v-for="post in posts" :key="post._id">
          <PostComponent2 v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
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
