<script setup lang="ts">
import { defineProps, ref } from 'vue';

const props = defineProps(["id"]);

const title = ref("Default Title");

// fix this later, updated will change base on if its been updated x minutes ago, x hours ago, x days ago, x weeks ago, and x years ago
const updated = ref(new Date());
const projectDescription = ref("Default Description");
const posts = ref(["Default Post Content"]);
const events = ref([]);
const polls = ref([]);


</script>

<template>
    <div class="row-flex">
        <div class="col-flex">
            <Card>
                <template #title> {{ title }} </template>
                <template #subtitle> Last Updated: {{ updated }}</template>
                <template #content> {{ projectDescription }}</template>
            </Card>
        </div>
        <div class="col-flex">
            <Card>
                <template #title> Card 2 </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>

.row-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2.5em;
}

.col-flex {
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    gap: 1em;
    width: 45%;
}
</style>