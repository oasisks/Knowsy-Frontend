<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";


const props = defineProps(["postid"]);
const post = ref<Record<string, string>>();
const loaded = ref(false);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

async function getPostFromId(_id: ObjectId) {
    let post;
    try {
        post = await fetchy(`/api/posts/${_id}`, "GET");
    } catch (_) {
        console.log("catching", _);
    }
    return post;
}

onBeforeMount(async () => {
    // post.value = $route.params._id;
    post.value = await getPostFromId(props.postid);
    loaded.value = true;
});
</script>
<template>
    <section v-if="loaded && post !== null">
        <div class="mb-10">
            <div class="mb-5 justify-items-start">
                <h1 class="text-xl font-semibold text-sky-500">Post</h1>
                <!-- <h2 class="text-3xl font-bold">{{ post?.name }}</h2> -->
            </div>
            <div class="mb-3">
                <p class="text-lg font-semibold">Author: {{ post?.author }}</p>
            </div>
            <div>
                <p class="text-lg font-semibold">Content:</p>
                <p class="text-lg">{{ post?.content }}</p>
            </div>
        </div>

        <p>[Insert Actionables here]</p>
        <p>[Insert Map here]</p>
        <p>[Insert Poll here]</p>
    </section>
</template>