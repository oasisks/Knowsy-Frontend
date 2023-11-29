<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);


const props = defineProps(["opinion", "root", "author"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const contentInput = ref("");
const feelingInput = ref<number>();

const stronglyAgreeCount = ref<number>();
const agreeCount = ref<number>();
const neutralCount = ref<number>();
const disagreeCount = ref<number>();
const stronglyDisagreeCount = ref<number>(); 

async function createOpinion(content: string, feeling: number) {
    try {
        await fetchy(`/api/opinions`, "POST", { body: {content: content, feeling: feeling, root: props.root._id} });
    } catch {
        return;
    }
    emit("refreshPosts");
}

async function getOpinions() {
    let query: Record<string, string> = props.author !== undefined ? { author: props.author._id } : { root: props.root._id };
    let response;
    try {
        response = await fetchy(`/api/opinions`, "GET", { query });
    } catch {
        return;
    }
}

onBeforeMount(async () => {
  await getOpinions();
  loaded.value = true;
});

</script>


<template>



</template>