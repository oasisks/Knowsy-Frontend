<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue';
import { fetchy } from '../../utils/fetchy';

const props = defineProps(["event"]);
let loaded = ref(false);
let author = ref("");
let attendees = ref([]);

const getUsernames = async () => {
    try {
        let user = await fetchy(`/api/users/id/${props.event.author}`, "GET", {});
        console.log("USERNAME:", user.username);
        author.value = user.username;
    } catch {
        return;
    }
};

const getRoster = async () => {
    try {
        props.event.attendees.forEach(async (id: any) => {
            console.log("trying for id", id);
            let user = await fetchy(`/api/users/id/${id}`, "GET", {});
            console.log("USERNAME:", user.username);
            attendees.value.push(user.username);
        })
    } catch {
        return;
    }
};

onBeforeMount(async () => {
    getUsernames();
    getRoster();
    loaded.value = true;
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <p class="text-sm font-medium">Name: {{ props.event.name }}</p>
        <p class="text-sm font-medium">Type: {{ props.event.type }}</p>
        <p class="text-sm font-medium">Created By: {{ author }}</p>
        <p class="text-sm font-medium">Happening on: {{ props.event.date }}</p>
        <p class="text-sm font-medium">Registered Attendees ({{ attendees.length }}):</p>
        <ul>
            <li v-for="attendee in attendees">@{{ attendee }}</li>
        </ul>
    </div>
</template>