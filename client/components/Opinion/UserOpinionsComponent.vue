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
  <div class="opinions py-10">
    <article v-for="opinion in opinions" :key="opinion._id" class="opinion shadow-sm">
      <div class="bg-white">
        <OpinionComponent v-bind:opinion="opinion" @refreshOpinions="getOpinions" />
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Styling for the h2 element */
h2 {
  font-size: 20px; /* Font size */
  font-weight: bold; /* Font weight */
  color: #333; /* Text color */
  margin-bottom: 10px; /* Bottom margin */
  /* Other styling properties as needed */
}

.newOpinion {
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* Align items at the top */
  max-width: 60%; /* Adjust width as needed */
  background-color: rgba(0, 123, 255, 0.1); /* Slightly tinted blue background */
  padding: 20px; /* Add padding for better visualization */
}

/* Styling for the opinion comment container */
.opinion {
  /* border: 1px solid #ccc; */
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  width: 60%;
  background-color: white;
}

/* Styling for the bar graph section */
.bar-graph {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 40vh; /* Adjust as needed to fit the desired vertical space */
  width: 60%; /* Full horizontal width of the page */
  background-color: #f0f0f0; /* Bar graph background color */
  padding: 20px; /* Add padding for better spacing */
  box-sizing: border-box; /* Include padding in width calculation */
}

/* Styling for each individual bar container */
.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* Show feeling on hover */
.bar-container:hover .feeling {
  opacity: 1;
}

/* Styling for the feeling below the bar */
.feeling {
  margin-top: 5px;
  font-weight: bold;
}

/* Styling for the bar */
.bar {
  width: 30px; /* Width of each bar */
  height: 0; /* Initial height of the bars */
  background-color: #007bff; /* Bar color */
  border-radius: 3px;
  transition: height 0.5s ease; /* Smooth transition for height changes */
}

/* Styling for the feeling tooltip (initially hidden) */
.amount {
  position: absolute;
  top: -30px; /* Position above the bar */
  left: 50%; /* Centered horizontally */
  transform: translateX(-50%);
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.8); /* Tooltip background color */
  color: #fff; /* Tooltip text color */
  padding: 4px 8px; /* Padding for the tooltip */
  border-radius: 4px; /* Rounded corners */
  transition: opacity 0.3s ease;
}

/* Show feeling tooltip on hover */
.bar:hover .amount {
  opacity: 1;
}
</style>
