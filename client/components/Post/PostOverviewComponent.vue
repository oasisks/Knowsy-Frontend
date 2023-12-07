<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from '../../utils/fetchy';


const props = defineProps(["postid"]);
const author = ref("default author");
const project = ref("default project")
const content = ref("default content");
const updated = ref(new Date());

const loaded = ref(false);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

console.log("hella tings, but its been accessed")

async function getPostFromId() {
    let post;
    try {
        post = await fetchy(`/api/posts/${props.postid}`, "GET");
        await getAuthorUsername(post.author);
        project.value = post.project;
        content.value = post.content;
        updated.value = post.dateUpdated;
        console.log("post values were found and set", post)
    } catch (_) {
        console.log("catching", _);
    }
    return post;
}

const getAuthorUsername = async (authorid: string) => {
    try {
        let user = await fetchy(`/api/users/id/${authorid}`, "GET", {});
        author.value = user.username;
    } catch {
        return;
    }
};

onBeforeMount(async () => {
    // post.value = $route.params._id;
    await getPostFromId();
    loaded.value = true;
});
</script>
<template>
    <section v-if="loaded">
        <Card>

            <template #title>Post</template>
            <template #subtitle>updated {{ formatDate(updated) }} by @{{ author }}</template>
            <template #content>
                {{ content }}
            </template>
        </Card>
    </section>
</template>