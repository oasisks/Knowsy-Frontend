<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import PollComponent from './PollComponent.vue';


const props = defineProps(["polls"]);
const finished = ref(false);
const emits = defineEmits(["refresh"]);

function sortPolls() {
    // we only want to sort by the prompt
    props.polls.sort((a: any, b: any) => {
        return a.prompt.localeCompare(b.prompt);
    })
}

onMounted(async () => {
    // on mount we want to sort the polls 
    console.log(props.polls);
    sortPolls();
    finished.value = true;
})

onUpdated(() => {
    sortPolls();
})

</script>

<template>
    <div v-if="finished" class="w-full overflow-auto h-64 flex flex-col gap-2">
        <div v-for="(poll, i) in props.polls" :key="poll.id">
            <PollComponent :poll="props.polls[i]" @refresh="emits(`refresh`)"/>
        </div>
    </div>
</template>

<style scoped>
</style>