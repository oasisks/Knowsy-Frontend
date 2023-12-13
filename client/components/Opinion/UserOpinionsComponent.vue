<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateOpinion from "./CreateOpinion.vue";
import OpinionComponent from "./OpinionComponent.vue";
import LoginFormVue from "../Login/LoginForm.vue";

const loaded = ref(false);
const props = defineProps(["rootId", "profile"]);

let opinions = ref<Array<Record<string, string>>>([]);
let feelings = ref([0, 0, 0, 0, 0, 0]);
const options = ref(["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);

async function getOpinions() {
  let query;
  let response;

  if (props.profile) {
    let user;
    try {
      user = await fetchy(`/api/users/${props.rootId}`, "GET", {});
    } catch {
      return;
    }
    query = { author: user._id };
    console.log("query:", query);
  } else {
    query = { root: props.rootId };
  }
  console.log("hello here", props.rootId, typeof props.profile, query);
  try {
    response = await fetchy(`/api/opinions`, "GET", { query });
  } catch {
    return;
  }
  console.log(response);
  opinions.value = response.opinions;
  feelings.value = response.feelings;
}

onBeforeMount(async () => {
  await getOpinions();
  loaded.value = true;
});
</script>

<template>
  <!-- <h2>All Comments</h2> -->
  <div class="opinions" v-if="loaded && opinions.length !== 0">
    <article v-for="opinion in opinions" :key="opinion._id" class="opinion">
      <div class="bg-white">
        <OpinionComponent v-bind:opinion="opinion" @refreshOpinions="getOpinions" />
      </div>
    </article>
  </div>
  <p v-else-if="loaded" class="py-8">No opinions found</p>
  <p v-else class="mt-6">Loading...</p>
</template>

<style scoped>



/* Styling for the opinion comment container */
.opinion {
  /* border: 1px solid #ccc; */
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  width: 60%;
  background-color: white;
}


</style>
