<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateOpinion from "./CreateOpinion.vue";

const loaded = ref(false);
const props = defineProps(["rootId", "profile"]);

let opinions = ref<Array<Record<string, string>>>([]);
let feelings = ref([0, 0, 0, 0, 0, 0]);
const options = ref(["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);


async function getOpinions() {
    let query;
    let response;

    if (props.profile) {
      query = { author: props.rootId };
    } else {
      query = { root: props.rootId }
    }
    console.log("hello here", props.rootId, typeof props.profile, query);
    try {
        response = await fetchy(`/api/opinions`, "GET", { query });
    } catch {
        return;
    }
    console.log(response)
    opinions.value = response.opinions;
    feelings.value = response.feelings;
};

onBeforeMount(async () => {
  await getOpinions();
  loaded.value = true;
});

</script>


<template>

  <h2>Opinions Summary</h2>
  <div class="bar-graph">
    <div v-for="(amount, index) in feelings.slice(1,)" :key="index" class="bar-container">
      <div class="bar" :style="{ height: amount * 30 + 'px' }">
        <div class="amount">{{ amount }}</div>
      </div>
      <div class="feeling">{{ options[index] }}</div>
    </div>
  </div>

  <h2>Add Opinion</h2>
  <CreateOpinion v-bind:rootId="props.rootId" @refreshOpinions="getOpinions"/>

  <h2>All Comments</h2>
  <div class="opinions">
    <article v-for="opinion in opinions" :key="opinion._id" class="opinion">
    <div class="comment-header">
      <p class="author">{{ opinion.author }}</p>
      <div v-if="(parseInt(opinion.feeling) - 1) !== -1" class="feeling-box">
        {{ options[parseInt(opinion.feeling) - 1] }}
      </div>
    </div>
    <p class="comment-content">{{ opinion.content }}</p>
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
  max-width: 75%; /* Adjust width as needed */
  background-color: rgba(0, 123, 255, 0.1); /* Slightly tinted blue background */
  padding: 20px; /* Add padding for better visualization */
}

/* Styling for the input text field */
.addComment {
  flex: 2; /* Takes more space */
  padding: 10px;
  border-radius: 8px; /* Rounded corners */
  border: 1px solid #ccc; /* Border color */
  margin-right: 10px; /* Margin between input and buttons */
  width: 550px;
}


/* Styling for the form and positioning the submit button */
.createOpinion {
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* Align items at the top */
}

/* Styling for the submit button */
.pure-button-primary {
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}


/* Styling for the opinion comment container */
.opinion {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

/* Styling for the comment header containing author and feeling */
.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* Styling for the author's name */
.author {
  font-weight: bold;
  margin: 0;
}

/* Styling for the feeling box */
.feeling-box {
  background-color: #007bff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
}

/* Styling for the comment content */
.comment-content {
  margin: 0;
  line-height: 1.4;
}

/* Styling for the bar graph section */
.bar-graph {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 40vh; /* Adjust as needed to fit the desired vertical space */
  width: 75%; /* Full horizontal width of the page */
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



