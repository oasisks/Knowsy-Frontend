<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import DateFormat from "../DateFormat/DateFormat.vue";

const props = defineProps(["posts"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

async function goToPost(postid: string) {
    void router.push({ path: `/posts/${postid}` });
}

</script>

<template>
    <div class="overflow-auto h-60 w-full flex flex-col mx-auto gap-2 p-2">
        <Card v-for="post, index in props.posts" class="shadow-md hover:shadow-xl hover:cursor-pointer" @click="goToPost(post._id)">
            <template #content>
                    <div class="flex flex-col gap-2">
                        <h5 class="text-xl font-bold dark:text-white">Update {{ index + 1 }}</h5>
                        <p>{{ post.content }}</p>
                        <DateFormat :date="new Date(post.dateCreated)"/>
                </div>
            </template>
        </Card>
    </div>
    <!-- <Timeline :value="props.posts" class="w-full overflow-y-auto" layout="horizontal">
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
                        <h5 class="text-xl font-bold dark:text-white">Post {{ slotProps.index + 1 }}</h5>
                        <p>{{ slotProps.item.content }}</p>
                        <DateFormat :date="new Date(slotProps.item.dateCreated)"/>
                        <p>{{ formatDate(slotProps.item.dateCreated) }}</p>
                    </div>
                </template>
            </Card>
        </template>
    </Timeline> -->
</template>
