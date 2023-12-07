<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import Timeline from 'primevue/timeline';
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["posts"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

async function goToPost(postid: string) {
    void router.push({ path: `/posts/${postid}` });
}

</script>

<template>
    <Timeline :value="props.posts" class="w-full md:w-20rem overflow-x-auto" layout="horizontal">
        <template #marker="slotProps">
            <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                :style="{ backgroundColor: '#9C27B0' }">
                <i class="pi pi-angle-right"></i>
            </span>
        </template>
        <template #content="slotProps">
            <Card class="cursor-pointer mx-3" @click="goToPost(slotProps.item._id)">
                <template #content>
                    <p>Post {{ slotProps.index + 1 }}</p>
                    <p>{{ slotProps.item.content }}</p>
                    <p>{{ formatDate(slotProps.item.dateCreated) }}</p>
                </template>
            </Card>
        </template>
    </Timeline>
</template>
