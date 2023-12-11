<script setup lang="ts">
import 'primeicons/primeicons.css';

import { defineProps, onMounted, ref } from 'vue';
import { fetchy } from '../../utils/fetchy';
import EventComponent from './EventComponent.vue';

const props = defineProps(["projectId"]);

let visible = ref(false);
let detailsVisible = ref(false);
let name = ref("Default Event Name");
let type = ref("Rally");
let date = ref(Date());
let location = ref([]);
let events = ref<Array<Record<string, string>>>([]);
let loaded = ref(false)

async function getEvents() {
    // this grabs all of the events associated with this project
    try {
        events.value = await fetchy(`/api/events/registered`, "GET");
    } catch {
    }
}

onMounted(async () => {
    await getEvents();
    loaded.value = true;
})
</script>

<template>
    <Card>
        <template #content>
            <section class="posts" v-if="loaded && events.length !== 0">
                <article v-for="event in events" :key="event._id">
                    <div class="px-8 py-4 bg-slate-50 rounded-lg hover:shadow">
                        <EventComponent :event="event" @refreshEvents="getEvents" />
                    </div>
                </article>
            </section>
            <p v-else-if="loaded">No events found</p>
            <p v-else>Loading...</p>

        </template>
    </Card>
</template>