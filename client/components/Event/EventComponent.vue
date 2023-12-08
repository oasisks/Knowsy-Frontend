<script setup lang="ts">
import Calendar from 'primevue/calendar';
import { defineProps, onMounted, ref } from 'vue';
import { fetchy } from '../../utils/fetchy';

const props = defineProps(["projectId"]);

let visible = ref(false);
let name = ref("Default Event Name");
let type = ref("Rally");
let date = ref(Date());
let location = ref([]);
let events = ref<Array<Record<string, string>>>([]);
let loaded = ref(false)

async function getEvents() {
    // this grabs all of the posts associated with this project
    try {
        console.log("for project w id", props.projectId);
        events.value = await fetchy(`/api/events/target/${props.projectId}`, "GET");
        console.log("GOT EVENTS:", events);
    } catch {
        console.log("issue with events");
    }
}

async function createEvent() {
    if (name.value.length === 0) { return; }
    visible.value = false;
    const dateStr = date.value.toString();
    const query = { name: name.value, type: type.value, date: dateStr, root: props.projectId };
    try {
        const msg = await fetchy(`/api/events`, "POST", { query });
        console.log(msg);
    } catch {

    }
    await getEvents();
}

async function registerForEvent(id: string) {
    try {
        await fetchy(`/api/event/register/${id}`, "POST");
    } catch {

    }
}

onMounted(async () => {
    await getEvents();
    console.log("EVENTS:", events.value)
    loaded.value = true;
})
</script>

<template>
    <Card>
        <template #title>
            <div class="flex flex-row justify-between">
                <p>Current Actionables</p>
                <Button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" icon="pi pi-plus"
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

                    <Button class="bg-blue-500 hover:bg-blue-700 text-white py-3 w-full rounded" label="Create Event"
                        @click="createEvent">
                    </Button>
                </div>
            </Dialog>
            <section class="posts" v-if="loaded && events.length !== 0">
                <div class="space-y-6">
                    <ScrollPanel style="width: 100%; height:10em;">
                        <article v-for="event in events" :key="event._id">
                            <Card>
                                <template #content>
                                    {{ event }}
                                    <Button class="bg-blue-500 hover:bg-blue-700 text-white py-3 w-full rounded"
                                        label="Register for Event" @click="registerForEvent(event._id)"></Button>
                                </template>
                            </Card>

                            <!-- <PostComponentForFeed v-if="editing !== post._id" :post="post" @refreshPosts="getPosts"
                                @editPost="updateEditing" /> -->
                        </article>
                    </ScrollPanel>
                </div>
            </section>
            <p v-else-if="loaded">No events found</p>
            <p v-else>Loading...</p>


        </template>
    </Card>
</template>