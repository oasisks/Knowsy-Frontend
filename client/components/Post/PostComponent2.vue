<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
let authorUsername = ref("");
let projectName = ref("");

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const getAuthorUsername = async () => {
  try {
    let user = await fetchy(`/api/users/id/${props.post.author}`, "GET", {});
    // console.log("USERNAME:", user.username);
    authorUsername.value = user.username;
  } catch {
    return;
  }
};

const getProjectName = async () => {
  try {
    let project = await fetchy(`/api/locationResources/${props.post.project}`, "GET", {});
    // console.log("NAME:", project.name);
    projectName.value = project.name;
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getProjectName();
  await getAuthorUsername();
});
</script>

<template>
  <div class="px-8 py-4 bg-orange-50 rounded-lg hover:shadow">
    <a :href="`/announcements/${props.post._id}`">
      <h2 class="text-lg font-semibold text-orange-500">Post</h2>
      <h1 class="text-2xl font-bold">Update to "{{ projectName }}"</h1>
      <p class="mb-6">{{ props.post.content }}</p>
      <div class="text-sm">
        <article class="flex space-x-6 items-center">
          <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }} by {{ authorUsername }}</p>
          <p v-else>Created on: {{ formatDate(props.post.dateCreated) }} by {{ authorUsername }}</p>
          <button class="button-error btn-small pure-button" @click="deletePost">Delete</button>
        </article>
      </div>
    </a>
  </div>
</template>