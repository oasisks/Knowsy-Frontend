<script setup lang="ts">
import RadiusResourceComponent from "@/components/RadiusResource/RadiusResourceComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn, rad } = storeToRefs(useUserStore());
const center = ref({ lat: 0, lng: 0 });

const loaded = ref(false);
let announcements = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getAnnouncements(latitude: string, longitude: string) {
  // TODO: switch out once user radius is able to be set
  // let locationResourceQuery: Record<string, string> = { latitude: latitude, longitude: longitude, radius: radius.toString() };
  let radiusResourcequery: Record<string, string> = { latitude: latitude, longitude: longitude, radius: rad.value.toString() };
  let radiusResourceResults;
  try {
    radiusResourceResults = await fetchy("/api/radiusResources", "GET", { query: radiusResourcequery });
    announcements.value = announcements.value.concat(radiusResourceResults);
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
  await getAnnouncements(center.value.lat.toString(), center.value.lng.toString());
  loaded.value = true;
});
</script>

<template>
  <div>
    <div class="row">
      <h2 class="text-2xl font-bold mb-8" v-if="!searchAuthor">Announcements:</h2>
      <h2 v-else>Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm @getPostsByAuthor="getAnnouncements" />
    </div>
    <section class="posts" v-if="loaded && announcements.length !== 0">
      <div class="space-y-6">
        <article v-for="announcement in announcements" :key="announcement._id">
          <RadiusResourceComponent v-if="editing !== announcement._id" :post="announcement" @refreshPosts="getAnnouncements" @editPost="updateEditing" />
        </article>
      </div>
    </section>
    <p v-else-if="loaded">No project updates found</p>
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
