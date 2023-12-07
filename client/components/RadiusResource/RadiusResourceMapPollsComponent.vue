<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { ObjectId } from "mongodb";
import { onBeforeMount, ref } from "vue";
import SmallMap from "@/components/Map/SmallMap.vue";
import Poll from "@/components/Poll/Poll.vue";

const props = defineProps(["resourceId"]);
const resource = ref<Record<string, string>>();
const resourceCoords = ref({ lng: 0, lat: 0 });
const loaded = ref(false);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

async function getResourceFromId(_id: ObjectId) {
  let resource;
  try {
    resource = await fetchy(`/api/radiusResources/${_id}`, "GET");
    resourceCoords.value.lng = resource.location.coordinates[0];
    resourceCoords.value.lat = resource.location.coordinates[1];
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
    <SmallMap :project-coords="resourceCoords" />
    <Poll :id="$props.resourceId" />
  </section>
</template>
