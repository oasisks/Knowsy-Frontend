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
    <Timeline :value="props.posts" class="w-full overflow-y-auto" layout="horizontal">
        <template #marker="slotProps">
            <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                :style="{ backgroundColor: '#9C27B0' }">
                <i class="pi pi-angle-right"></i>
            </span>
        </template>
        <template #content="slotProps">
            <Card class="cursor-pointer mx-3 shadow hover:shadow-lg w-full h-full" @click="goToPost(slotProps.item._id)">
                <template #content>
                    <div class="flex flex-col gap-2">
                        <h5 class="text-xl font-bold dark:text-white">Post {{ slotProps.index + 1}}</h5>
                        <p>{{ slotProps.item.content }}</p>
                        <p>{{ formatDate(slotProps.item.dateCreated) }}</p>
                    </div>
                </template>
            </Card>
        </template>
    </Timeline>
</template>
