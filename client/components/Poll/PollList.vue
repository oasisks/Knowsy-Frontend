<script setup lang="ts">
import { onMounted } from 'vue';
import PollComponent from './PollComponent.vue';


const props = defineProps(["polls"]);
const emits = defineEmits(["refresh"]);

onMounted(async () => {
})

</script>

<template>
    <div class="w-full overflow-auto h-64 flex flex-col gap-2">
        <div v-for="(poll, i) in props.polls" :key="poll.id">
            <PollComponent :poll="props.polls[i]" @refresh="emits(`refresh`)"/>
        </div>
    </div>
</template>

<style scoped>
</style>