<script setup lang="ts">
import 'primeicons/primeicons.css';

import { defineProps, onMounted, ref } from 'vue';
import { fetchy } from '../../utils/fetchy';
import EventDetails from "./EventDetails.vue";

const props = defineProps(["event"]);
const emit = defineEmits(["refreshEvents"]);

let detailsVisible = ref(false);
let name = ref("Default Event Name");
let loaded = ref(false);
let isRegistered = ref(false);

async function checkIsRegistered() {
    try {
        const eventId = props.event._id;
        isRegistered.value = await fetchy(`/api/events/isregistered/${eventId}`, "GET");
    } catch {

    }
}

async function registerForEvent(id: string) {
    try {
        await fetchy(`/api/event/register/${id}`, "POST");
        emit("refreshEvents");
        isRegistered.value = true;
    } catch {

    }
}

async function deregisterForEvent(id: string) {
    try {
        await fetchy(`/api/event/${id}`, "DELETE");
        emit("refreshEvents");
        isRegistered.value = false;
    } catch {

    }
}

onMounted(async () => {
    checkIsRegistered();
    loaded.value = true;
})
</script>

<template>
    <section v-if="loaded">
        <Card>
            <template #title>
                <div class="flex flex-row justify-between">
                    <p>{{ props.event.name }}</p>
                    <Button icon="pi pi-ellipsis-v" @click="detailsVisible = true">
                    </Button>
                </div>
            </template>
            <template #content>
                <Dialog v-model:visible="detailsVisible" modal header="Event Details" :style="{ width: '50rem' }"
                    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :dismissable-mask="true"
                    v-on:after-hide="name = ''">
                    <EventDetails :event="event" />
                </Dialog>
                <p class="text-sm font-medium">Type: {{ props.event.type }}</p>
                <p class="text-sm font-medium">Happening on: {{ props.event.date }}</p>

                <Button v-if="!isRegistered" class="bg-sky-500 hover:bg-sky-600 text-white py-3 w-full rounded"
                    label="Register for Event" @click="registerForEvent(props.event._id)"></Button>
                <Button v-else class="bg-blue-500 hover:bg-blue-700 text-white py-3 w-full rounded"
                    label="Deregister for Event" @click="deregisterForEvent(props.event._id)"> </Button>
            </template>
        </Card>
    </section>
</template>