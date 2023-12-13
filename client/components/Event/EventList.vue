<script setup lang="ts">
import 'primeicons/primeicons.css';
import Calendar from 'primevue/calendar';

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
        events.value = await fetchy(`/api/events/target/${props.projectId}`, "GET");
    } catch {
    }
}

async function createEvent() {
    if (name.value.length === 0) { return; }
    visible.value = false;
    const dateStr = date.value.toString();
    const query = { name: name.value, type: type.value, date: dateStr, root: props.projectId };
    try {
        const msg = await fetchy(`/api/events`, "POST", { query });
    } catch {

    }
    await getEvents();
}

onMounted(async () => {
    await getEvents();
    loaded.value = true;
})
</script>

<template>
    <Card>
        <template #title>
            <div class="flex flex-row justify-between">
                <p class="text-black">Current Actionables</p>
                <Button class="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded" icon="pi pi-plus"
                    @click="visible = true">
                </Button>
            </div>
        </template>
        <template #content>
            <Dialog v-model:visible="visible" modal header="Create Event" :style="{ width: '50rem' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :dismissable-mask="true" v-on:after-hide="name = ''">
                <div class="flex flex-col gap-3">
                    <p class="text-sm font-medium">Create an event for this project!</p>
                    <p class="text-sm font-medium">Event Name:</p>
                    <InputText type="text" v-model="name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Name" />
                    <div v-if="name.length === 0"
                        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">NOTE: </strong>
                        <span class="block sm:inline">Needs a name to create event</span>
                    </div>
                    <p class="text-sm font-medium">Type:</p>
                    <InputText type="text" v-model="type"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Type" />
                    <p class="text-sm font-medium">Date:</p>
                    <Calendar v-model="date" showIcon />

                    <Button class="bg-sky-500 hover:bg-sky-700 text-white py-3 w-full rounded" label="Create Event"
                        @click="createEvent">
                    </Button>
                </div>
            </Dialog>

            <div class="space-y-6">
                <ScrollPanel style="width: 100%; height:20em;">
                    <section class="posts" v-if="loaded && events.length !== 0">
                        <article v-for="event in events" :key="event._id">
                            <EventComponent class="mt-6" :event="event" @refreshEvents="getEvents" />
                        </article>
                    </section>
                    <p v-else-if="loaded">No events found</p>
                    <p v-else>Loading...</p>
                </ScrollPanel>
            </div>
        </template>
    </Card>
</template>