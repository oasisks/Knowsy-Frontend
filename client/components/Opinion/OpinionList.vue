<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";


const { isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);
const props = defineProps(["opinion", "root", "author"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
let opinions = ref<Array<Record<string, string>>>([]);
let feelings = ref<Array<Record<number, number>>>([]);


const contentInput = ref("");
const selectedOption = ref("None");
const options = ref(["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);
const feelingInput = ref(options.value.indexOf(selectedOption.value) + 1);


async function createOpinion(content: string, feeling: number) {
    try {
        await fetchy(`/api/opinions`, "POST", { body: {content: content, feeling: feeling, root: props.root._id} });
    } catch {
        return;
    }
    emit("refreshPosts");
};

async function getOpinions() {
    let query: Record<string, string> = props.author !== undefined ? { author: props.author._id } : { root: props.root._id };
    let response;
    try {
        response = await fetchy(`/api/opinions`, "GET", { query });
    } catch {
        return;
    }
    opinions.value = response.opinions;
    feelings.value = response.feelings;
};


onBeforeMount(async () => {
  await getOpinions();
  loaded.value = true;
});

</script>


<template>
  <div class="summary">
    <p> Strongly Disagree: {{ feelings[0] }}</p>
    <p> Disagree: {{ feelings[1] }}</p>
    <p> Neutral: {{ feelings[2] }}</p>
    <p> Agree: {{ feelings[3] }}</p>
    <p> Strongly Agree: {{ feelings[4] }}</p>
  </div>
  <form @submit.prevent="createOpinion(contentInput, feelingInput)" class="createOpinion">
    <fieldset>
      <legend>Add Opinion</legend>

      <input id="opinion" type="text" v-model="contentInput" placeholder="comment" />
      <div class="card flex justify-content-center">
        <SelectButton v-model="selectedOption" :options="options" aria-labelledby="basic" 
        @click="feelingInput = options.indexOf(selectedOption) + 1"/>
      </div>

      <p> {{options.indexOf(selectedOption)}}, {{ selectedOption }}, {{ feelingInput }}</p>
      <button type="submit" class="pure-button-primary pure-button">Send</button>
    </fieldset>
  </form>
  <div class="opinions">
    <article v-for="opinion in opinions" :key="opinion._id">
      <p>{{ opinion.author }}</p>
      <p>{{ opinion.content }}</p>
      <p>{{ opinion.feeling }}</p>
    </article>
  </div>
</template>


<style scoped>


</style>


