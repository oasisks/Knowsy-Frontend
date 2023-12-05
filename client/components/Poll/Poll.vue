<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { fetchy } from '../../utils/fetchy';
// we want to grab all the polls by the project id
const props = defineProps(["id"]);
const polls = ref([]);
const optionsRef = ref<Array<Record<string, string>>>([]);
const promptRef = ref("");

async function getPolls() {
    // given the id, we grab all the polls that exists
    try {
        console.log("Hello");
        const poll = await fetchy(`/api/madeup/${props.id}`, "GET");
    } catch {

    }
}

async function createPoll() {
    const root = props.id;
    const prompt = promptRef.value;
    const options = optionsRef.value;
    const query = {prompt, root};
    const body = {options};
    try {
        const poll = await fetchy(`/api/polls`, "POST", {query, body});
        console.log(poll);
    } catch {

    }
}


onMounted(async () => {
    await getPolls();
})
</script>

<template>
    <Card>
        <template #title> 
            <div class="row-flex">
                <p>Polls</p>
                <Button 
                    icon="pi pi-plus" 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    @click="createPoll"
                >
                </Button>
            </div>
        </template>

        <template #content>
            <hr>
            <br>
            <div class="content-flex">
                <p>{{ props.id }}</p>
            </div>
        </template>
    </Card>
</template>

<style scoped>

.row-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 1em;
    margin-right: 1em;
}

.content-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>