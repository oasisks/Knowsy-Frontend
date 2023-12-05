<script setup lang="ts">
const props = defineProps(["poll"]);

</script>

<template>
<div class="w-full flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
    <h5 class="text-xl font-bold dark:text-white">{{ props.poll.prompt }}</h5>
    <div class="flex flex-col gap-3">
        <Button
            v-for="option in props.poll.options"
            class="outline outline-2 outline-offset-2 outline-gray-300 bg-cyan-50 hover:bg-cyan-500 text-white font-bold py-2 w-full rounded"
        >
        <p class="text-black pl-2.5 py-2 ml-0.5">{{ option }}</p>
        </Button>
    </div>
</div>


</template>

<style scoped>
</style>