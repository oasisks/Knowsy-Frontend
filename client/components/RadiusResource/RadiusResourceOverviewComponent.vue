<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import EventList from "../Event/EventList.vue";

const props = defineProps(["resourceId"]);
const resource = ref<Record<string, any>>({});
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
  console.log(resource.value);
});
</script>

<template>
  <section v-if="loaded && resource !== null">
    <div class="mb-10">
      <div class="mb-5 justify-items-start">
        <h1 class="text-xl font-semibold text-sky-500">Announcement</h1>
        <h2 class="text-3xl font-bold">{{ resource.name }}</h2>
      </div>
      <div class="mb-3">
        <p class="text-lg font-semibold">Critical dates:</p>
        <article v-for="date in resource.criticalDates" :key="date">
          <!-- <p class="text-lg">{{ JSON.parse(date).info }} on {{ JSON.parse(date).time }}</p> -->
          <!-- <p class="text-lg">{{ JSON.parse(date.toString()) }}</p> -->
          <!-- TODO: reformat this -->
          <p class="text-lg">{{ date.time }}</p>
        </article>
      </div>
      <div>
        <p class="text-lg font-semibold">Description:</p>
        <p class="text-lg">{{ resource?.content }}</p>
      </div>
    </div>

    <EventList :projectId="props.resourceId" />
  </section>
</template>
