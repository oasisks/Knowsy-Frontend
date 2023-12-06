<script setup lang="ts">
import { onMounted } from 'vue';
import PollComponent from './PollComponent.vue';


const props = defineProps(["polls"]);

onMounted(async () => {
    console.log(props.polls);
})

</script>

<template>
    <div class="w-full overflow-auto h-64 flex flex-col gap-2">
        <div v-for="poll in props.polls">
            <PollComponent :poll="poll"/>
        </div>

    </div>

</template>

<style scoped>
</style>