<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeUpdate, onMounted, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["poll"]);
const emits = defineEmits(["refresh"]);
const hasVoted = ref(false);
const userId = ref<Record<string, string>>({});
const userOption = ref("");
const finished = ref(false);
const frequency = ref<Map<string, number>>(new Map());
const percents = ref<Map<string, number>>(new Map());
const isOwner = ref(false);


// we need the ability for the user to delete the poll if the author of the poll
// is the current user

async function deletePoll() {
    try {
        await fetchy(`/api/polls/${props.poll._id}`, "DELETE");
    } catch {

    }
    emits("refresh");
}
async function vote(choice: string) {
    const query = {choice};
    try {
        const result = await fetchy(`/api/polls/add/${props.poll._id}`, "PATCH", {query});
    } catch {

    }
    await emits("refresh");
    userOption.value = choice;
}

async function getUserID() {
    try {
        userId.value = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    } catch {

    }
}

function changefrequency() {
    props.poll.votes.forEach((vote: Record<string, string>) => {
        // we will also do the percentages here
        if (frequency.value.has(vote.option)) {
            let number = frequency.value.get(vote.option)! + 1;
            frequency.value.set(vote.option, number);
        } else {
            frequency.value.set(vote.option, 1);
        }
    });
    frequency.value.forEach((value: number, key: string) => {
        percents.value.set(key, value / props.poll.votes.length);
    })
}

onMounted(async () => {
    await getUserID();
    await changefrequency();
    hasVoted.value = props.poll.votes.filter((vote: Record<string, string>) => {
        const isEqual = vote.user === userId.value._id;
        if (isEqual) {
            userOption.value = vote.option;
        }

        return vote.user === userId.value._id;
    }).length !== 0;
    finished.value = true;
    isOwner.value = userId.value._id === props.poll.author;
})

onBeforeUpdate(async() => {
    frequency.value = new Map();
    percents.value = new Map();
    await changefrequency();
})
</script>

<template>
<div v-if="finished" class="w-full flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
    <div class="flex flex-row justify-between">
        <h5 class="text-xl font-bold dark:text-white">{{ props.poll.prompt }}</h5>
        <Button
            v-if="isOwner"
            class="hover:bg-red-100 text-red-700 rounded"
            icon="pi pi-trash"
            @click="deletePoll"
        >
        </Button>
    </div>
    <div class="flex flex-col gap-3">
        <div v-for="option in props.poll.options">
            <Button
                v-if="userOption === option"
                class="outline outline-2 outline-offset-2 outline-gray-300 bg-cyan-500 text-white font-bold py-2 w-full rounded"
            >
                <div class="flex flex-row justify-between w-full">
                    <p class="text-black pl-2.5 py-2 ml-0.5">{{ option }}</p>
                    <p class="text-gray-200 pl-2.5 py-2 mr-2">{{ percents.get(option)! * 100 }}%</p>
                </div>
            </Button>
            <Button
                v-else
                class="outline outline-2 outline-offset-2 outline-gray-300 bg-cyan-50 hover:bg-cyan-500 text-white font-bold py-2 w-full rounded"
                @click="vote(option);"
            >
            <p class="text-black pl-2.5 py-2 ml-0.5">{{ option }}</p>
            </Button>

        </div>
    </div>
</div>
</template>

<style scoped>
</style>