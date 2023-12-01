<!-- <script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["opinion", "root"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const contentInput = ref("");
const feelingInput = ref<number>();

async function createOpinion(content: string, feeling: number) {
    try {
        await fetchy(`/api/opinions`, "POST", { body: {content: content, feeling: feeling, root: props.root._id} });
    } catch {
        return;
    }
    emit("refreshPosts");
}

async function deleteOpinion() {
    try {
        await fetchy(`api/opinions/${props.opinion._id}`, "DELETE");
    } catch {
        return;
    }
    emit("refreshPosts");
}

</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template> -->
