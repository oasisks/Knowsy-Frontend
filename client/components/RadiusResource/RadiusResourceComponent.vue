<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <div class="px-8 py-4 bg-slate-50 rounded-lg hover:shadow">
    <a :href="`/announcements/${props.post._id}`">
      <h2 class="text-lg font-semibold">Announcement</h2>
      <h1 class="text-2xl font-bold">{{ props.post.name }}</h1>
      <p class="mb-6">{{ props.post.content }}</p>
      <div class="text-sm">
        <article class="timestamp">
          <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
          <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
        </article>
      </div>
    </a>
  </div>
</template>

<!-- <style scoped>
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
</style> -->
