<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";


const props = defineProps(["rootId"]);
const emit = defineEmits(["refreshOpinions"]);


const contentInput = ref("");
const selectedOption = ref("None");
const options = ref(["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);
const feelingInput = ref(options.value.indexOf(selectedOption.value) + 1);


async function createOpinion(content: string, feeling: number) {
    try {
        await fetchy(`/api/opinions`, "POST", { body: {content: content, feeling: feeling, root: props.rootId} });
    } catch {
        return;
    }
    contentInput.value = "";
    selectedOption.value = "None";
    emit("refreshOpinions");
};

</script>


<template>


  <div class="newOpinion">
    <form @submit.prevent="createOpinion(contentInput, feelingInput)" class="createOpinion">
    <fieldset>
      <input class="addComment" type="text" v-model="contentInput" placeholder="comment" required/>
      <button type="submit" class="pure-button-primary pure-button">Send</button>
      <div class="card flex justify-content-center mt-2">
        <SelectButton v-model="selectedOption" :options="options" aria-labelledby="basic" 
        @click="feelingInput = options.indexOf(selectedOption) + 1"/>
      </div>
    </fieldset>
  </form>
  </div>


</template>


<style scoped>
.newOpinion {
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* Align items at the top */
  max-width: 75%; /* Adjust width as needed */
  background-color: rgba(0, 123, 255, 0.1); /* Slightly tinted blue background */
  padding: 20px; /* Add padding for better visualization */
}

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
  background-color: #0ea5e9;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

</style>



