<script setup lang="ts">
import OpinionList from "@/components/Opinion/OpinionList.vue";
import PostOverviewComponent from "@/components/Post/PostOverviewComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import LocationPanelForPost from "../components/LocationResource/LocationPanelForPost.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let post = ref<Record<string, string>>({})

</script>

<template>
    <main class="sm:mx-12 sm:my-10 mx-4 my-3">
        <section v-if="isLoggedIn">

            <div class="row-flex">
                <div class="col-flex-left">
                    <Card>
                        <template #content>
                            <PostOverviewComponent v-bind:postid="$route.params._id" />
                            <OpinionList v-bind:rootId="$route.params._id" :profile="false" />
                        </template>
                    </Card>

                </div>

                <div class="col-flex-right">
                    <h1 class="text-3xl font-semibold">About this project:</h1>
                    <Card>
                        <template #content>
                            <LocationPanelForPost v-bind:postid="$route.params._id" />
                        </template>
                    </Card>

                </div>
            </div>



        </section>
        <h1 v-else>Please login!</h1>
    </main>
</template>

<style scoped>
.row-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2.5em;
}

.col-flex-left {
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    width: 60%;
}

.col-flex-right {
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    width: 37%;
}
</style>