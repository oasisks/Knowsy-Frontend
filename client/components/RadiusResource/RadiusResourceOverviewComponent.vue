<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { ObjectId } from "mongodb";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["resourceId"]);
const resource = ref<Record<string, string>>();
const loaded = ref(false);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

async function getResourceFromId(_id: ObjectId) {
  let resource;
  try {
    resource = await fetchy(`/api/radiusResources/${_id}`, "GET");
  } catch (_) {
    console.log("catching", _);
  }
  return resource;
}

onBeforeMount(async () => {
  resource.value = await getResourceFromId(props.resourceId);
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && resource !== null">
    <h1>Announcement:</h1>
    <p>{{ resource?.name }}</p>
    <!-- <p class="author">{{ props.post.name }}</p> -->
    <p>{{ resource?.content }}</p>
  </section>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
