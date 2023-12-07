<script setup lang="ts">
import { useUserStore } from "@/stores/user";
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
        author.value = post.author
        project.value = post.project
        content.value = post.content
        console.log("post values were found and set", post)
    } catch (_) {
        console.log("catching", _);
    }
    return post;
}

onBeforeMount(async () => {
    // post.value = $route.params._id;
    await getPostFromId();
    loaded.value = true;
});
</script>
<template>
    <section v-if="loaded">
        <div class="mb-10">
            <div class="mb-5 justify-items-start">
                <h1 class="text-xl font-semibold text-sky-500">Post</h1>
                <!-- <h2 class="text-3xl font-bold">{{ post?.name }}</h2> -->
            </div>
            <div class="mb-3">
                <p class="text-lg font-semibold">Author: {{ author }}</p>
            </div>
            <div>
                <p class="text-lg font-semibold">Content:</p>
                <p class="text-lg">{{ content }}</p>
            </div>
        </div>

        <p>[Insert Actionables here]</p>
        <p>[Insert Map here]</p>
        <p>[Insert Poll here]</p>
    </section>
</template>