<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["opinion"]);
const emit = defineEmits(["refreshOpinions"]);
const options = ref(["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);

async function deleteOpinion() {
  try {
    await fetchy(`/api/opinions/${props.opinion._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshOpinions");
}
</script>

<template>
  <div class="comment-header">
    <p class="author">{{ props.opinion.author }}</p>
    <div v-if="parseInt(props.opinion.feeling) - 1 !== -1" class="feeling-box">
      {{ options[parseInt(props.opinion.feeling) - 1] }}
    </div>
  </div>
  <p class="comment-content">{{ props.opinion.content }}</p>
  <div class="delete-button-container">
    <button v-if="props.opinion.author === currentUsername" class="trashButton" @click="deleteOpinion">
      <span class="gg-trash"></span>
    </button>
  </div>
</template>

<style scoped>
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

/* Styling for the delete button container */
.delete-button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Your button styles */
.trashButton {
  /* Your button styles */
  background-color: transparent;
  border: none;
  color: #007bff; /* Change this to your desired button color */
  cursor: pointer;
}

/* Style for the trashcan icon */

.gg-trash {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(var(--ggs, 1));
  width: 10px;
  height: 12px;
  border: 2px solid transparent;
  box-shadow:
    0 0 0 2px,
    inset -2px 0 0,
    inset 2px 0 0;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
  margin-top: 4px;
}
.gg-trash::after,
.gg-trash::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
}
.gg-trash::after {
  background: currentColor;
  border-radius: 3px;
  width: 16px;
  height: 2px;
  top: -4px;
  left: -5px;
}
.gg-trash::before {
  width: 10px;
  height: 4px;
  border: 2px solid;
  border-bottom: transparent;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  top: -7px;
  left: -2px;
}
</style>
