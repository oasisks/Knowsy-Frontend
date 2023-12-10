<script setup lang="ts">
import InputText from "primevue/inputtext";
import { defineProps, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import PollList from "./PollList.vue";
// we want to grab all the polls by the project id
const props = defineProps(["id"]);
const polls = ref<Array<Record<string, string>>>([]);
const promptRef = ref("");
const isCreatingPoll = ref(false);
const addingOption = ref(false);
const optionText = ref("");
const optionCount = ref<Array<string>>([]);
const isBlank = ref(false);
const scopedError = ref("");
// const optionCount = ref(0);

async function getPolls() {
  // given the id, we grab all the polls that exists
  try {
    polls.value = await fetchy(`/api/polls/project/${props.id}`, "GET");
  } catch {}
  return polls.value;
}

async function togglePoll() {
  isCreatingPoll.value = !isCreatingPoll.value;
  // when I toggle poll, I also want to reset everything else
  optionText.value = "";
  addingOption.value = false;
  promptRef.value = "";
  optionCount.value = [];
  isBlank.value = false;
}

async function createPoll() {
  // first we need to check if any of the options are left blank
  const blank = optionCount.value.filter((value) => value === "");
  isBlank.value = blank.length !== 0 || promptRef.value.length === 0 || optionCount.value.length === 0;
  const root = props.id;
  const prompt = promptRef.value;
  const options = optionCount.value;
  const query = { prompt, root };
  const body = { options };
  if (isBlank.value) {
    scopedError.value = blank.length !== 0 ? "Some option(s) are not filled" : promptRef.value.length === 0 ? "Missing title" : "Needs at least 1 option";
    return;
  }
  try {
    const poll = await fetchy(`/api/polls`, "POST", { query, body });
  } catch {}
  // after we make the poll we will result everything back to the beginning
  await togglePoll();
  await getPolls();
}

async function remove(index: number) {
  optionCount.value = optionCount.value.filter((elt, i) => {
    return i !== index;
  });
}

onMounted(async () => {
  await getPolls();
});
</script>

<template>
  <Card>
    <template #title>
      <div class="row-flex">
        <p>Polls</p>
        <Button v-if="!isCreatingPoll" icon="pi pi-plus" class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded" @click="togglePoll"> </Button>
        <Button v-if="isCreatingPoll" class="bg-red-500 hover:bg-red-700 text-lg text-white py-2 px-4 rounded" label="cancel" @click="togglePoll"> </Button>
      </div>
    </template>

    <template #content>
      <hr />
      <br />
      <div class="content-flex">
        <div v-if="!isCreatingPoll" class="w-full">
          <p v-if="polls.length === 0">Oopsies, no polls for this project yet.</p>
          <PollList v-else :polls="polls" @refresh="getPolls" />
        </div>
        <div v-if="isCreatingPoll" class="poll">
          <InputText
            type="text"
            v-model="promptRef"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Question Title"
            @keyup.enter="createPoll"
          />
          <div class="w-full flex flex-row gap-4" v-for="(input, index) in optionCount">
            <InputText
              :key="index"
              type="text"
              :value="input"
              @input="
                (event) => {
                  optionCount[index] = (event.target as HTMLInputElement).value;
                }
              "
              @keyup.enter="createPoll"
              class="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Option"
            />
            <Button class="hover:bg-red-100 text-red-700 rounded" icon="pi pi-trash" @click="remove(index)"> </Button>
          </div>

          <Button
            class="bg-sky-500 hover:bg-sky-600 text-white py-3 w-full rounded"
            label="Add an Option"
            @click="
              addingOption = true;
              optionCount.push(``);
            "
          >
          </Button>
          <Button class="bg-lime-500 hover:bg-lime-700 text-white py-3 w-full rounded" label="Create Poll" @click="createPoll"> </Button>
          <div v-if="isBlank" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Uh Oh! </strong>
            <span class="block sm:inline">{{ scopedError }}!</span>
          </div>
        </div>
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

.poll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  width: 90%;
}
</style>
