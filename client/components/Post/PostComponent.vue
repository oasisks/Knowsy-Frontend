<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const clickable = ref(false);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

function goToPostPage() {
  if (clickable.value) {
    void router.push({path: `/posts/${props.post._id}`});
  }
}
</script>

<template>
  <div class="px-8 py-4 bg-slate-50 rounded-lg hover:shadow" v-on:click="goToPostPage">
    <div>
      <div class="cursor-pointer" @mouseover="clickable = true" @mouseleave="clickable = false">
        <p class="author">{{ props.post.author }}</p>
        <p>{{ props.post.content }}</p>
      </div>
      <div class="base">
        <menu v-if="props.post.author == currentUsername">
          <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
          <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
        </menu>
        <article class="timestamp cursor-pointer" @mouseover="clickable = true" @mouseleave="clickable = false">
          <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}
          </p>
          <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
